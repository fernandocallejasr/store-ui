import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, RouterProvider, createMemoryRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import { CartProvider } from "../context/CartContext";

// MainLayout's pending UI reads useNavigation(), which only reports "loading"
// for client-side navigations — it stays "idle" through the router's initial
// hydration. So these tests must navigate to reach the code under test; a
// pending loader on first render would exercise hydrateFallbackElement instead
// and pass without touching MainLayout at all.
const renderLayoutAndNavigate = (loader: () => unknown) => {
	const router = createMemoryRouter(
		[
			{
				path: "/",
				element: <MainLayout />,
				children: [
					{ index: true, element: <Link to="/target">Go to target</Link> },
					{ path: "target", element: <div>Route content</div>, loader },
				],
			},
		],
		{ initialEntries: ["/"] },
	);
	render(
		<CartProvider>
			<RouterProvider router={router} />
		</CartProvider>,
	);

	return userEvent.click(screen.getByRole("link", { name: /go to target/i }));
};

describe("MainLayout structure", () => {
	it("wraps route content in a main landmark", async () => {
		await renderLayoutAndNavigate(() => "done");

		expect(await screen.findByText("Route content")).toBeInTheDocument();
		expect(screen.getByRole("main")).toContainElement(screen.getByText("Route content"));
	});

	it("puts the footer outside the main landmark", async () => {
		await renderLayoutAndNavigate(() => "done");

		expect(screen.getByRole("main")).not.toContainElement(
			screen.getByRole("contentinfo"),
		);
	});
});

describe("MainLayout pending UI", () => {
	it("shows the loading view while a navigation's loader is pending", async () => {
		await renderLayoutAndNavigate(() => new Promise(() => {}));

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByText(/loading/i)).toBeInTheDocument();
		expect(screen.queryByText("Route content")).not.toBeInTheDocument();
	});

	it("renders route content once the loader resolves", async () => {
		await renderLayoutAndNavigate(() => "done");

		expect(await screen.findByText("Route content")).toBeInTheDocument();
		expect(screen.queryByRole("status")).not.toBeInTheDocument();
	});
});
