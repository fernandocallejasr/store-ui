import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Outlet, RouterProvider, createMemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { SESSION_STORAGE_KEY } from "../../context/authContextValue";
import type { Session } from "../auth/types";
import MobileMenu from "./MobileMenu";

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 1, name: "My User" } };

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

// An outside target to click, and pages to land on, so closing can be observed.
const Layout = () => (
	<>
		<MobileMenu />
		<button type="button">Outside</button>
		<Outlet />
	</>
);

const renderMenu = () => {
	const router = createMemoryRouter(
		[
			{
				path: "/",
				element: <Layout />,
				children: [
					{ index: true, element: <p>Shop page</p> },
					{ path: "contact", element: <p>Contact page</p> },
					{ path: "login", element: <p>Login page</p> },
					{ path: "register", element: <p>Register page</p> },
					{ path: "profile", element: <p>Profile page</p> },
				],
			},
		],
		{ initialEntries: ["/"] },
	);

	render(
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>,
	);

	return router;
};

const menuButton = () => screen.getByRole("button", { name: "Menu" });
const panel = () => screen.queryByRole("navigation", { name: "Mobile" });
const openMenu = async () =>
	userEvent.click(await screen.findByRole("button", { name: "Menu" }));

describe("MobileMenu", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("starts closed", async () => {
		renderMenu();

		await screen.findByText("Shop page");

		expect(menuButton()).toHaveAttribute("aria-expanded", "false");
		expect(panel()).not.toBeInTheDocument();
	});

	it("opens on click and points the button at the panel it controls", async () => {
		renderMenu();

		await openMenu();

		expect(menuButton()).toHaveAttribute("aria-expanded", "true");
		const controlled = document.getElementById(menuButton().getAttribute("aria-controls")!);
		expect(controlled).toContainElement(panel());
	});

	it("lists the shop and contact pages", async () => {
		renderMenu();

		await openMenu();

		const nav = panel()!;
		expect(within(nav).getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/");
		expect(within(nav).getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
	});

	it("offers Log in and Register while anonymous", async () => {
		renderMenu();

		await openMenu();

		expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
		expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/register");
		expect(screen.queryByRole("button", { name: "Log out" })).not.toBeInTheDocument();
	});

	it("shows who is signed in, with Profile and Log out", async () => {
		signIn();
		renderMenu();

		await openMenu();

		expect(screen.getByText("Signed in as My User")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute("href", "/profile");
		expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: "Log in" })).not.toBeInTheDocument();
	});

	it("includes the theme toggle", async () => {
		renderMenu();

		await openMenu();

		expect(screen.getByRole("button", { name: /toggle dark mode/i })).toBeInTheDocument();
	});

	it("closes after a link is followed", async () => {
		renderMenu();
		await openMenu();

		await userEvent.click(screen.getByRole("link", { name: "Contact" }));

		expect(await screen.findByText("Contact page")).toBeInTheDocument();
		expect(panel()).not.toBeInTheDocument();
		expect(menuButton()).toHaveAttribute("aria-expanded", "false");
	});

	it("closes when the link chosen is the page already open", async () => {
		renderMenu();
		await openMenu();

		await userEvent.click(within(panel()!).getByRole("link", { name: "Shop" }));

		expect(panel()).not.toBeInTheDocument();
	});

	it("closes when the route changes some other way, such as the back button", async () => {
		const router = renderMenu();
		await openMenu();

		await act(async () => {
			await router.navigate("/contact");
		});

		expect(await screen.findByText("Contact page")).toBeInTheDocument();
		expect(panel()).not.toBeInTheDocument();
	});

	it("closes on Escape and returns focus to the menu button", async () => {
		renderMenu();
		await openMenu();

		await userEvent.keyboard("{Escape}");

		expect(panel()).not.toBeInTheDocument();
		expect(menuButton()).toHaveFocus();
	});

	it("closes when a pointer goes down outside it", async () => {
		renderMenu();
		await openMenu();

		await userEvent.click(screen.getByRole("button", { name: "Outside" }));

		expect(panel()).not.toBeInTheDocument();
	});

	it("logging out signs the visitor out and closes the menu", async () => {
		signIn();
		renderMenu();
		await openMenu();

		await userEvent.click(screen.getByRole("button", { name: "Log out" }));

		expect(panel()).not.toBeInTheDocument();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});
});
