import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "../../context/CartContext";
import { CART_STORAGE_KEY } from "../../context/cartContextValue";
import { AuthProvider } from "../../context/AuthContext";
import { SESSION_STORAGE_KEY } from "../../context/authContextValue";
import type { Product } from "../products/types";
import type { Session } from "../auth/types";
import Header from "./Header";

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 1, name: "My User" } };

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
	productId: 1,
	price: 10,
	imageUrl: "./mockUrl.png",
	name: "Test Product",
	description: "A product",
	popularity: "high",
	...overrides,
});

const seedCart = (items: { product: Product; quantity: number }[]) => {
	localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const renderHeader = () =>
	render(
		<AuthProvider>
			<CartProvider>
				<MemoryRouter>
					<Header />
				</MemoryRouter>
			</CartProvider>
		</AuthProvider>,
	);

describe('Header Component', () => {
	beforeEach(() => {
		localStorage.clear();
	});

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

	it('should render Shop, Contact, Log in, Register links in navigation component', () => {
		renderHeader();

		expect(screen.getByRole('link', {name: "Shop"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "Contact"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "Log in"})).toBeInTheDocument();
		expect(screen.getByRole('link', {name: "Register"})).toBeInTheDocument();
	});

	it('should render each navigation link with the correct href', () => {
		renderHeader();

		expect(screen.getByRole('link', { name: "Shop" })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: "Contact" })).toHaveAttribute('href', '/contact');
		expect(screen.getByRole('link', { name: "Log in" })).toHaveAttribute('href', '/login');
		expect(screen.getByRole('link', { name: "Register" })).toHaveAttribute('href', '/register');
	});

	it('offers a closed menu button for small screens', () => {
		renderHeader();

		expect(screen.getByRole('button', { name: "Menu" })).toHaveAttribute('aria-expanded', 'false');
	});

	describe('signed-in state', () => {
		it('shows the Log in link while anonymous, and no user menu', () => {
			renderHeader();

			expect(screen.getByRole('link', { name: "Log in" })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /my user/i })).not.toBeInTheDocument();
		});

		it('replaces the Login link with the user menu once signed in', () => {
			signIn();

			renderHeader();

			expect(screen.getByRole('button', { name: /my user/i })).toBeInTheDocument();
			expect(screen.queryByRole('link', { name: "Log in" })).not.toBeInTheDocument();
		});

		it('hides the Register link from someone who already has an account', () => {
			signIn();

			renderHeader();

			expect(screen.queryByRole('link', { name: "Register" })).not.toBeInTheDocument();
		});

		it('offers no Profile link while anonymous', () => {
			renderHeader();

			expect(screen.queryByRole('link', { name: "Profile" })).not.toBeInTheDocument();
		});

		it('offers Profile in the user menu once signed in', async () => {
			signIn();
			renderHeader();

			await userEvent.click(screen.getByRole('button', { name: /my user/i }));

			expect(screen.getByRole('link', { name: "Profile" })).toHaveAttribute('href', '/profile');
		});

		it('logging out brings the Log in link back', async () => {
			signIn();
			renderHeader();

			await userEvent.click(screen.getByRole('button', { name: /my user/i }));
			await userEvent.click(screen.getByRole('button', { name: "Log out" }));

			expect(screen.getByRole('link', { name: "Log in" })).toBeInTheDocument();
			expect(screen.queryByRole('button', { name: /my user/i })).not.toBeInTheDocument();
		});
	});

	describe('cart badge', () => {
		it('shows 0 when the cart is empty', () => {
			renderHeader();

			const cartLink = screen.getByRole('link', { name: /cart/i });

			expect(cartLink).toHaveTextContent('0');
		});

		it('shows the total quantity of items in the cart', () => {
			seedCart([
				{ product: makeProduct({ productId: 1 }), quantity: 2 },
				{ product: makeProduct({ productId: 2 }), quantity: 3 },
			]);

			renderHeader();

			const cartLink = screen.getByRole('link', { name: /cart/i });

			expect(cartLink).toHaveTextContent('5');
		});

		it('caps the badge at 99+ once the total reaches 100', () => {
			seedCart([{ product: makeProduct({ productId: 1 }), quantity: 150 }]);

			renderHeader();

			expect(screen.getByText('99+')).toBeInTheDocument();
		});
	});
});
