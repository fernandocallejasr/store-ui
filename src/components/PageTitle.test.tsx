import { render, screen } from "@testing-library/react";
import PageTitle from "./PageTitle";

describe('PageTitle Component', () => {
	it('should render the title text', () => {
		render(<PageTitle title="Test Title" />);

		expect(screen.getByText("Test Title")).toBeInTheDocument();
	});

	it('should render inside a div with page-title class', () => {
		render(<PageTitle title="Test Title" />);

		const titleElement = screen.getByText("Test Title");

		expect(titleElement).toHaveClass("page-title");
	});
});
