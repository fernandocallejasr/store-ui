import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

const renderHeader = () =>
	render(
		<MemoryRouter>
			<Header />
		</MemoryRouter>,
	);

describe('Header Component', () => {
	it('should render header element', () => {
		renderHeader();

		const header = screen.getByRole('banner');

		expect(header).toBeInTheDocument();
	});

	it('should contain Stickers Shop text in header title', () => {
		renderHeader();

		const mainTitle = screen.getByText(/Stickers Shop/i);

		expect(mainTitle).toBeInTheDocument();
	});

	it('should render navigation element in header', () => {
		renderHeader();

		const navComponent = screen.getByRole('navigation');

		expect(navComponent).toBeInTheDocument();
	});

	it('should render Home, About, Contact, Login links in navigation component', () => {
		renderHeader();

		expect(screen.getByRole('link', {name: "Home"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "About"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "Contact"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "Login"})).toBeInTheDocument();
	});

	it('should render each navigation link with the correct href', () => {
		renderHeader();

		expect(screen.getByRole('link', { name: "Home" })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: "About" })).toHaveAttribute('href', '/about');
		expect(screen.getByRole('link', { name: "Contact" })).toHaveAttribute('href', '/contact');
		expect(screen.getByRole('link', { name: "Login" })).toHaveAttribute('href', '/login');
	});
});
