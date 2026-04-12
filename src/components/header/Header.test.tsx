import { render, screen } from "@testing-library/react";
import Header from "./Header";

describe('Header Component', () => {
	it('should render header element', () => {
		render(<Header />);

		const header = screen.getByRole('banner');

		expect(header).toBeInTheDocument();
	});

	it('should contain Stickers Shop text in header title', () => {
		render(<Header />);

		const mainTitle = screen.getByText(/Stickers Shop/i);

		expect(mainTitle).toBeInTheDocument();
	});

	it('should render navigation element in header', () => {
		render(<Header />);

		const navComponent = screen.getByRole('navigation');

		expect(navComponent).toBeInTheDocument();
	});

	it('should render Home, About, Contact, Login links in navigation component', () => {
		render(<Header />);

		const homeLink = screen.getByRole('link', {name: "Home"});
		expect(homeLink).toBeInTheDocument();

		const aboutLink = screen.getByRole('link', {name: "About"});
		expect(aboutLink).toBeInTheDocument();

		const contactLink = screen.getByRole('link', {name: "Contact"});
		expect(contactLink).toBeInTheDocument();

		const loginLink = screen.getByRole('link', {name: "Login"});
		expect(loginLink).toBeInTheDocument();
	});

	it('should render all navigation links with correct href attributes', () => {
		render(<Header />);

		const links = screen.getAllByRole('link');

		links.forEach(link => {
			expect(link).toHaveAttribute('href', '/');
		});
	});
});
