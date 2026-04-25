import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorView from "./ErrorView";

describe("ErrorView", () => {
	it("should expose an alert role for assistive technology", () => {
		render(<ErrorView message="Something failed" />);

		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("should render the provided message", () => {
		render(<ErrorView message="Something failed" />);

		expect(screen.getByText("Something failed")).toBeInTheDocument();
	});

	it("should render the provided title", () => {
		render(<ErrorView message="Something failed" title="Oops!" />);

		expect(
			screen.getByRole("heading", { level: 2, name: "Oops!" })
		).toBeInTheDocument();
	});

	it("should not render a heading when title is not provided", () => {
		render(<ErrorView message="Something failed" />);

		expect(
			screen.queryByRole("heading", { level: 2 })
		).not.toBeInTheDocument();
	});

	it("should not render a retry button when onRetry is not provided", () => {
		render(<ErrorView message="Something failed" />);

		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("should render a retry button and call onRetry when clicked", async () => {
		const onRetry = vi.fn();
		const user = userEvent.setup();

		render(
			<ErrorView
				message="Something failed"
				onRetry={onRetry}
				retryLabel="Try again"
			/>
		);

		const retryButton = screen.getByRole("button", { name: "Try again" });
		await user.click(retryButton);

		expect(onRetry).toHaveBeenCalledTimes(1);
	});
});
