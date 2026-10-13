import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

const renderFooter = () =>
	render(
		<MemoryRouter>
			<Footer />
		</MemoryRouter>,
	);

describe('Footer Component', () => {
	it('should render footer element', () => {
		renderFooter();

		expect(screen.getByRole('contentinfo')).toBeInTheDocument();
	});

	it('should render Built with text', () => {
		renderFooter();

		expect(screen.getByText(/built with/i)).toBeInTheDocument();
	});

	it('should render GitHub link with correct attributes', () => {
		renderFooter();

		const githubLink = screen.getByRole('link', { name: /fernandocallejasr/i });

		expect(githubLink).toHaveAttribute('href', 'https://github.com/fernandocallejasr');
		expect(githubLink).toHaveAttribute('target', '_blank');
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('links to the contact page', () => {
		renderFooter();

		expect(screen.getByRole('link', { name: "Contact" })).toHaveAttribute('href', '/contact');
	});
});
