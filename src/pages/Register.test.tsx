import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	RouterProvider,
	createMemoryRouter,
	redirect,
	type ActionFunction,
} from "react-router-dom";
import Register from "./Register";
import type { RegisterActionResult } from "./registerAction";

const renderRegister = (action: ActionFunction = () => null) => {
	const router = createMemoryRouter(
		[
			{ path: "/register", element: <Register />, action },
			{ path: "/login", element: <h1>Login page</h1> },
		],
		{ initialEntries: ["/register"] },
	);

	return render(<RouterProvider router={router} />);
};

const fillAndSubmit = async (
	overrides: Partial<Record<string, string>> = {},
) => {
	const values = {
		Name: "My User",
		"Mobile number": "5550000000",
		Email: "myuser@example.com",
		Password: "supersecret",
		"Confirm password": "supersecret",
		...overrides,
	};

	for (const [label, value] of Object.entries(values)) {
		if (value) await userEvent.type(screen.getByLabelText(label), value);
	}

	await userEvent.click(screen.getByRole("button", { name: "Create account" }));
};

describe("Register page", () => {
	it("renders a field for every detail the backend asks for, plus a confirmation", () => {
		renderRegister();

		expect(screen.getByLabelText("Name")).toBeInTheDocument();
		expect(screen.getByLabelText("Mobile number")).toBeInTheDocument();
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument();
	});

	it("posts every field value to the route action", async () => {
		let seen: Record<string, string> = {};
		const action: ActionFunction = async ({ request }) => {
			const formData = await request.formData();
			seen = Object.fromEntries(
				[...formData.entries()].map(([key, value]) => [key, String(value)]),
			);
			return null;
		};

		renderRegister(action);
		await fillAndSubmit();

		expect(seen).toEqual({
			name: "My User",
			mobileNumber: "5550000000",
			email: "myuser@example.com",
			password: "supersecret",
			confirmPassword: "supersecret",
		});
	});

	it("shows an action error in an alert region", async () => {
		const result: RegisterActionResult = {
			status: "error",
			message: "The passwords do not match.",
		};

		renderRegister(() => result);
		await fillAndSubmit();

		expect(await screen.findByRole("alert")).toHaveTextContent("The passwords do not match.");
	});

	it("lists every per-field message the backend rejected", async () => {
		const result: RegisterActionResult = {
			status: "error",
			message: "Request validation failed",
			fieldErrors: {
				mobileNumber: ["Mobile number must be exactly 10 digits"],
				password: ["Password length must be between 8 and 20 characters"],
			},
		};

		renderRegister(() => result);
		await fillAndSubmit();

		const alert = await screen.findByRole("alert");
		expect(alert).toHaveTextContent("Request validation failed");

		const messages = within(alert)
			.getAllByRole("listitem")
			.map((item) => item.textContent);
		expect(messages).toEqual([
			"Mobile number must be exactly 10 digits",
			"Password length must be between 8 and 20 characters",
		]);
	});

	// One field can break two rules at once: a blank name trips both @NotBlank
	// and @Size, so the map's values are lists and both have to show.
	it("shows every message for a field that broke more than one rule", async () => {
		const result: RegisterActionResult = {
			status: "error",
			message: "Request validation failed",
			fieldErrors: {
				name: [
					"Name is required",
					"The length of the name should be between 5 and 100 characters",
				],
			},
		};

		renderRegister(() => result);
		await fillAndSubmit();

		const alert = await screen.findByRole("alert");
		expect(within(alert).getAllByRole("listitem")).toHaveLength(2);
	});

	it("renders no list when the failure has no per-field detail", async () => {
		const result: RegisterActionResult = {
			status: "error",
			message: "Something went wrong. Please try again.",
		};

		renderRegister(() => result);
		await fillAndSubmit();

		const alert = await screen.findByRole("alert");
		expect(within(alert).queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("sends the visitor to the login page when the action redirects there", async () => {
		renderRegister(() => redirect("/login?registered=1"));
		await fillAndSubmit();

		expect(await screen.findByRole("heading", { name: "Login page" })).toBeInTheDocument();
	});

	it("disables the submit button while the action is running", async () => {
		let release = () => {};
		const pending = new Promise<null>((resolve) => {
			release = () => resolve(null);
		});

		renderRegister(() => pending);
		await fillAndSubmit();

		expect(await screen.findByRole("button", { name: "Creating account…" })).toBeDisabled();

		release();
	});

	it("offers a way back to the login page", () => {
		renderRegister();

		expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
	});
});
