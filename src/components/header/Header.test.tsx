import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { CART_STORAGE_KEY } from "../../context/cartContextValue";
import type { Product } from "../products/types";
import Header from "./Header";

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
		<CartProvider>
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		</CartProvider>,
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
