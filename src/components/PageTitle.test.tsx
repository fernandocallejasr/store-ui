import { render, screen } from "@testing-library/react";
import PageTitle from "./PageTitle";

describe('PageTitle Component', () => {
	it('should render the title text', () => {
		render(<PageTitle title="Test Title" />);

		expect(screen.getByText("Test Title")).toBeInTheDocument();
	});

	it('renders the title as the page heading', () => {
		render(<PageTitle title="Test Title" />);

		expect(screen.getByRole('heading', { level: 1, name: 'Test Title' })).toBeInTheDocument();
	});
});
