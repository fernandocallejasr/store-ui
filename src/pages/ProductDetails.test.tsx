import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { useCart } from "../context/useCart";
import type { Product } from "../components/products/types";
import ProductDetails from "./ProductDetails";

const testProduct: Product = {
	productId: 13,
	price: 89,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "Popularity",
};

const CartProbe = () => {
	const { totalQuantity } = useCart();
	return <div data-testid="cart-total">{totalQuantity}</div>;
};

const renderDetails = () =>
	render(
		<CartProvider>
			<MemoryRouter
				initialEntries={[
					{ pathname: `/products/${testProduct.productId}`, state: { product: testProduct } },
				]}
			>
				<Routes>
					<Route path="/products/:id" element={<ProductDetails />} />
				</Routes>
				<CartProbe />
			</MemoryRouter>
		</CartProvider>,
	);

describe('Product Details', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('renders the product name', () => {
		renderDetails();

		expect(screen.getByRole('heading', { name: testProduct.name })).toBeInTheDocument();
	});

	it('starts the stepper at 1 with the decrease button disabled', () => {
		renderDetails();

		expect(screen.getByTestId('quantity')).toHaveTextContent('1');
		expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeDisabled();
	});

	it('increments the quantity and enables the decrease button', async () => {
		renderDetails();

		await userEvent.click(screen.getByRole('button', { name: /increase quantity/i }));

		expect(screen.getByTestId('quantity')).toHaveTextContent('2');
		expect(screen.getByRole('button', { name: /decrease quantity/i })).toBeEnabled();
	});

	it('decrements the quantity but never below 1', async () => {
		renderDetails();

		const increase = screen.getByRole('button', { name: /increase quantity/i });
		const decrease = screen.getByRole('button', { name: /decrease quantity/i });

		await userEvent.click(increase);
		await userEvent.click(increase);
		expect(screen.getByTestId('quantity')).toHaveTextContent('3');

		await userEvent.click(decrease);
		expect(screen.getByTestId('quantity')).toHaveTextContent('2');
	});

	it('adds the chosen quantity to the cart and resets the stepper to 1', async () => {
		renderDetails();

		const increase = screen.getByRole('button', { name: /increase quantity/i });
		await userEvent.click(increase);
		await userEvent.click(increase);
		expect(screen.getByTestId('quantity')).toHaveTextContent('3');

		await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));

		expect(screen.getByTestId('cart-total')).toHaveTextContent('3');
		expect(screen.getByTestId('quantity')).toHaveTextContent('1');
	});
});
