import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import UserMenu from "./UserMenu";
import { AuthProvider } from "../../context/AuthContext";
import { SESSION_STORAGE_KEY } from "../../context/authContextValue";
import type { Session } from "./types";

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 1, name: "My User" } };

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

// An outside target to click, so the outside-pointer close can be exercised.
const renderMenu = () =>
	render(
		<AuthProvider>
			<MemoryRouter>
				<UserMenu />
				<button type="button">Outside</button>
			</MemoryRouter>
		</AuthProvider>,
	);

const trigger = () => screen.getByRole("button", { name: /my user/i });
const logOutButton = () => screen.queryByRole("button", { name: "Log out" });
const profileLink = () => screen.queryByRole("link", { name: "Profile" });

describe("UserMenu", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders nothing when there is no session", () => {
		const { container } = renderMenu();

		expect(screen.queryByText("My User")).not.toBeInTheDocument();
		// Only the outside button remains.
		expect(container.querySelectorAll("button")).toHaveLength(1);
	});

	it("shows the signed-in user's name", () => {
		signIn();

		renderMenu();

		expect(trigger()).toHaveTextContent("My User");
	});

	it("keeps the panel closed until the trigger is used", () => {
		signIn();

		renderMenu();

		expect(logOutButton()).not.toBeInTheDocument();
		expect(trigger()).toHaveAttribute("aria-expanded", "false");
	});

	it("opens the panel on click and reports it to assistive tech", async () => {
		signIn();
		renderMenu();

		await userEvent.click(trigger());

		expect(logOutButton()).toBeInTheDocument();
		expect(trigger()).toHaveAttribute("aria-expanded", "true");
		expect(trigger()).toHaveAttribute("aria-controls", logOutButton()!.closest("div")!.id);
	});

	it("closes again when the trigger is clicked a second time", async () => {
		signIn();
		renderMenu();

		await userEvent.click(trigger());
		await userEvent.click(trigger());

		expect(logOutButton()).not.toBeInTheDocument();
	});

	it("closes on Escape and returns focus to the trigger", async () => {
		signIn();
		renderMenu();
		await userEvent.click(trigger());

		await userEvent.keyboard("{Escape}");

		expect(logOutButton()).not.toBeInTheDocument();
		expect(trigger()).toHaveFocus();
	});

	it("closes when a pointer goes down outside the menu", async () => {
		signIn();
		renderMenu();
		await userEvent.click(trigger());

		await userEvent.click(screen.getByRole("button", { name: "Outside" }));

		expect(logOutButton()).not.toBeInTheDocument();
	});

	it("links to the profile page", async () => {
		signIn();
		renderMenu();

		await userEvent.click(trigger());

		expect(profileLink()).toHaveAttribute("href", "/profile");
	});

	it("closes the panel when Profile is followed", async () => {
		signIn();
		renderMenu();
		await userEvent.click(trigger());

		await userEvent.click(profileLink()!);

		expect(profileLink()).not.toBeInTheDocument();
		expect(trigger()).toHaveAttribute("aria-expanded", "false");
	});

	it("logging out clears the session and removes the menu", async () => {
		signIn();
		renderMenu();
		await userEvent.click(trigger());

		await userEvent.click(logOutButton()!);

		expect(screen.queryByText("My User")).not.toBeInTheDocument();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});
});
