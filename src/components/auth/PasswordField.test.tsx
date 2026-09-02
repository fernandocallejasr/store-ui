import type { FormEvent } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordField from "./PasswordField";

const passwordInput = () => screen.getByLabelText("Password");

describe("PasswordField", () => {
	it("renders a labelled password input that starts masked", () => {
		render(<PasswordField name="password" label="Password" />);

		expect(passwordInput()).toHaveAttribute("type", "password");
		expect(passwordInput()).toHaveAttribute("name", "password");
		expect(passwordInput()).toHaveAttribute("autocomplete", "current-password");
	});

	it("reveals the password when the toggle is pressed", async () => {
		render(<PasswordField name="password" label="Password" />);
		expect(passwordInput()).toHaveAttribute("type", "password");

		await userEvent.click(screen.getByRole("button", { name: "Show password" }));

		expect(passwordInput()).toHaveAttribute("type", "text");
		expect(screen.getByRole("button", { name: "Hide password" })).toBeInTheDocument();
	});

	it("keeps what has been typed when the password is revealed", async () => {
		render(<PasswordField name="password" label="Password" />);

		await userEvent.type(passwordInput(), "s3cret");
		await userEvent.click(screen.getByRole("button", { name: "Show password" }));

		expect(passwordInput()).toHaveValue("s3cret");
		expect(passwordInput()).toHaveAttribute("type", "text");
	});

	it("masks the password again when the toggle is pressed twice", async () => {
		render(<PasswordField name="password" label="Password" />);

		await userEvent.click(screen.getByRole("button", { name: "Show password" }));
		await userEvent.click(screen.getByRole("button", { name: "Hide password" }));

		expect(passwordInput()).toHaveAttribute("type", "password");
	});

	it("never submits the form it sits in", async () => {
		const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<PasswordField name="password" label="Password" />
			</form>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Show password" }));

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("marks the input invalid and points it at the error region", () => {
		render(<PasswordField name="password" label="Password" invalid describedBy="login-error" />);

		expect(passwordInput()).toHaveAttribute("aria-invalid", "true");
		expect(passwordInput()).toHaveAttribute("aria-describedby", "login-error");
	});
});
