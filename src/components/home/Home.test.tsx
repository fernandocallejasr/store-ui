import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe('Home Component', () => {
	it('should render the page heading', () => {
		render(<Home />);

		expect(screen.getByText("My Page Heading")).toBeInTheDocument();
	});

	it('should render the descriptive paragraph', () => {
		render(<Home />);

		expect(screen.getByText(/Add a touch of creativity/i)).toBeInTheDocument();
	});

	it('should render product listings', () => {
		render(<Home />);

		const productHeadings = screen.getAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBeGreaterThan(0);
	});
});
