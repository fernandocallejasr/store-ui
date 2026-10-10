import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Profile from "./Profile";
import type { User } from "../components/auth/types";

const profile: User = {
	userId: 7,
	name: "My User",
	email: "myuser@example.com",
	mobileNumber: "5550000000",
};

const renderProfile = () => {
	const router = createMemoryRouter(
		[{ path: "/profile", element: <Profile />, loader: () => profile }],
		{ initialEntries: ["/profile"] },
	);

	return render(<RouterProvider router={router} />);
};

const fieldsShown = () => {
	const terms = screen.getAllByRole("term").map((term) => term.textContent);
	const definitions = screen.getAllByRole("definition").map((definition) => definition.textContent);
	return Object.fromEntries(terms.map((term, index) => [term, definitions[index]]));
};

describe("Profile page", () => {
	it("shows the heading", async () => {
		renderProfile();

		expect(await screen.findByRole("heading", { name: "Your Profile" })).toBeInTheDocument();
	});

	it("shows each field of the loaded profile against its label", async () => {
		renderProfile();
		await screen.findByRole("heading", { name: "Your Profile" });

		expect(fieldsShown()).toEqual({
			"Name": "My User",
			"Email": "myuser@example.com",
			"Mobile number": "5550000000",
			"User ID": "7",
		});
	});

	it("is read-only", async () => {
		renderProfile();
		await screen.findByRole("heading", { name: "Your Profile" });

		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});
});
