import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { useCart } from "../../context/useCart";
import type { Product } from "./types";
import ProductCard from "./ProductCard";

const testProduct: Product = {
	productId: 13,
	price: 89,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "Popularity"
}

const CartProbe = () => {
	const { totalQuantity } = useCart();
	return <div data-testid="cart-total">{totalQuantity}</div>;
};

const renderCard = (product: Product = testProduct) =>
	render(
		<CartProvider>
			<MemoryRouter>
				<ProductCard product={product} />
				<CartProbe />
			</MemoryRouter>
		</CartProvider>
	);

describe('Product Card', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should render product image with correct alt text', () => {
		renderCard();

		const imageElement = screen.getByRole('img');

		expect(imageElement).toBeInTheDocument();

		expect(imageElement).toHaveAttribute('src', expect.stringContaining('mockUrl'));
		expect(imageElement).toHaveAttribute('alt', expect.stringContaining(testProduct.name));
	});

	it('should render product title in heading element', () => {
		renderCard();

		const h2Element = screen.getByRole('heading', { level: 2 });

		expect(h2Element).toBeInTheDocument();
		expect(h2Element).toHaveTextContent(testProduct.name);
	});

	it('should render product description', () => {
		renderCard();

		const description = screen.getByText(testProduct.description);

		expect(description).toBeInTheDocument();
	});

	it('should render product price', () => {
		renderCard();

		expect(screen.getByText("$89.00")).toBeInTheDocument();
	});

	it('links to the product details page', () => {
		renderCard();

		const link = screen.getByRole('link');

		expect(link).toHaveAttribute('href', `/products/${testProduct.productId}`);
	});

	it('renders an Add to cart button that is not nested inside the link', () => {
		renderCard();

		const link = screen.getByRole('link');
		const button = screen.getByRole('button', { name: /add .* to cart/i });

		expect(button).toBeInTheDocument();
		// Invalid + inaccessible to nest a button inside an anchor; they must be siblings.
		expect(link).not.toContainElement(button);
	});

	it('adds a single unit to the cart when the button is clicked', async () => {
		renderCard();

		const button = screen.getByRole('button', { name: /add .* to cart/i });

		expect(screen.getByTestId('cart-total')).toHaveTextContent('0');

		await userEvent.click(button);
		expect(screen.getByTestId('cart-total')).toHaveTextContent('1');

		await userEvent.click(button);
		expect(screen.getByTestId('cart-total')).toHaveTextContent('2');
	});
});
