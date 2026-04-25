import { render, screen } from "@testing-library/react";
import LoadingView from "./LoadingView";

describe("LoadingView", () => {
	it("should expose a status role for assistive technology", () => {
		render(<LoadingView />);

		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("should render the provided message", () => {
		render(<LoadingView message="Loading products…" />);

		expect(screen.getByText("Loading products…")).toBeInTheDocument();
	});
});
