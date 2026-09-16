import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { ProtectedRoute, REDIRECT_PATH_STORAGE_KEY } from "./ProtectedRoute";
import { AuthProvider } from "../../context/AuthContext";
import { SESSION_STORAGE_KEY } from "../../context/authContextValue";
import type { Session } from "./types";

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 1, name: "My User" } };

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

const renderAt = (path: string) => {
	const router = createMemoryRouter(
		[
			{
				element: <ProtectedRoute />,
				children: [{ path: "/cart", element: <h1>Cart contents</h1> }],
			},
			{ path: "/login", element: <h1>Login page</h1> },
		],
		{ initialEntries: [path] },
	);

	return render(
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>,
	);
};

describe("ProtectedRoute", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	it("sends an anonymous visitor to the login page", async () => {
		renderAt("/cart");

		expect(await screen.findByRole("heading", { name: "Login page" })).toBeInTheDocument();
		expect(screen.queryByText("Cart contents")).not.toBeInTheDocument();
	});

	it("renders the guarded route for a signed-in visitor", async () => {
		signIn();

		renderAt("/cart");

		expect(await screen.findByRole("heading", { name: "Cart contents" })).toBeInTheDocument();
		expect(screen.queryByText("Login page")).not.toBeInTheDocument();
	});

	it("remembers where an anonymous visitor was trying to go", async () => {
		renderAt("/cart");

		await screen.findByRole("heading", { name: "Login page" });
		expect(sessionStorage.getItem(REDIRECT_PATH_STORAGE_KEY)).toBe("/cart");
	});

	it("records nothing when the visitor is already signed in", async () => {
		signIn();

		renderAt("/cart");

		await screen.findByRole("heading", { name: "Cart contents" });
		expect(sessionStorage.getItem(REDIRECT_PATH_STORAGE_KEY)).toBeNull();
	});
});
