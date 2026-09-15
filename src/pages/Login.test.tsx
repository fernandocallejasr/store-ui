import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter, type ActionFunction } from "react-router-dom";
import Login from "./Login";
import type { LoginActionResult } from "./loginAction";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../context/useAuth";
import type { User } from "../components/auth/types";

const testUser: User = {
	userId: 1,
	name: "My User",
	email: "myuser@example.com",
	mobileNumber: "5550000",
};

// Renders the auth state next to the page so the tests can assert on what the
// login effect actually stored, rather than trusting that it ran.
const AuthProbe = () => {
	const { session } = useAuth();

	// No optional chaining on session.user: a non-null session is guaranteed to
	// carry one. That guarantee is the whole point of the Session shape.
	return (
		<span data-testid="auth-state">
			{session ? `authenticated:${session.user.name}` : "anonymous"}
		</span>
	);
};

const renderLogin = (action: ActionFunction = () => null) => {
	const router = createMemoryRouter(
		[
			{
				path: "/login",
				element: (
					<>
						<Login />
						<AuthProbe />
					</>
				),
				action,
			},
		],
		{ initialEntries: ["/login"] },
	);

	return render(
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>,
	);
};

const fillAndSubmit = async (username: string, password: string) => {
	await userEvent.type(screen.getByLabelText("Username"), username);
	await userEvent.type(screen.getByLabelText("Password"), password);
	await userEvent.click(screen.getByRole("button", { name: "Log in" }));
};

describe("Login page", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders a username field, a password field and a submit button", () => {
		renderLogin();

		expect(screen.getByLabelText("Username")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
	});

	it("posts both field values to the route action", async () => {
		const seen: Record<string, string> = {};
		const action: ActionFunction = async ({ request }) => {
			const formData = await request.formData();
			seen.username = String(formData.get("username"));
			seen.password = String(formData.get("password"));
			return null;
		};

		renderLogin(action);
		await fillAndSubmit("myuser", "secret");

		expect(seen).toEqual({ username: "myuser", password: "secret" });
	});

	it("shows an action error in an alert region", async () => {
		const result: LoginActionResult = {
			status: "error",
			message: "Incorrect username or password.",
		};

		renderLogin(() => result);
		await fillAndSubmit("ghost", "secret");

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Incorrect username or password.",
		);
	});

	it("shows the backend message on success", async () => {
		const result: LoginActionResult = {
			status: "success",
			response: { message: "Correctly logged in", user: null, jwtToken: null },
		};

		renderLogin(() => result);
		await fillAndSubmit("myuser", "secret");

		expect(await screen.findByRole("status")).toHaveTextContent("Correctly logged in");
	});

	it("stores the session when the action returns both a token and a user", async () => {
		const result: LoginActionResult = {
			status: "success",
			response: { message: "Correctly logged in", user: testUser, jwtToken: "a.b.c" },
		};

		renderLogin(() => result);
		await fillAndSubmit("myuser", "secret");

		expect(await screen.findByTestId("auth-state")).toHaveTextContent(
			"authenticated:My User",
		);
	});

	it("stays anonymous when a successful response carries no token", async () => {
		const result: LoginActionResult = {
			status: "success",
			response: { message: "Correctly logged in", user: null, jwtToken: null },
		};

		renderLogin(() => result);
		await fillAndSubmit("myuser", "secret");

		expect(await screen.findByRole("status")).toHaveTextContent("Correctly logged in");
		expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
	});

	it.each([
		["a token but no user", { user: null, jwtToken: "a.b.c" }],
		["a user but no token", { user: testUser, jwtToken: null }],
	])("stays anonymous when the response carries %s", async (_label, partial) => {
		const result: LoginActionResult = {
			status: "success",
			response: { message: "Correctly logged in", ...partial },
		};

		renderLogin(() => result);
		await fillAndSubmit("myuser", "secret");

		expect(await screen.findByRole("status")).toHaveTextContent("Correctly logged in");
		expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
	});

	it("disables the submit button while the action is running", async () => {
		let release = () => {};
		const pending = new Promise<null>((resolve) => {
			release = () => resolve(null);
		});

		renderLogin(() => pending);
		await fillAndSubmit("myuser", "secret");

		expect(await screen.findByRole("button", { name: "Signing in…" })).toBeDisabled();

		release();
	});
});
