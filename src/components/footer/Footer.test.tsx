import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe('Footer Component', () => {
	it('should render footer element', () => {
		render(<Footer />);

		const footer = screen.getByRole('contentinfo');

		expect(footer).toBeInTheDocument();
	});

	it('should render Built with text', () => {
		render(<Footer />);

		expect(screen.getByText(/built with/i)).toBeInTheDocument();
	});

	it('should render GitHub link with correct attributes', () => {
		render(<Footer />);

		const githubLink = screen.getByRole('link', { name: /fernandocallejasr/i });

		expect(githubLink).toBeInTheDocument();
		expect(githubLink).toHaveAttribute('href', 'https://github.com/fernandocallejasr');
		expect(githubLink).toHaveAttribute('target', '_blank');
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
	});
});
