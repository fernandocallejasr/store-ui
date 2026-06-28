import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { CART_STORAGE_KEY } from "../context/cartContextValue";
import type { Product } from "../components/products/types";
import Cart from "./Cart";

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
	productId: 1,
	price: 10,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "high",
	...overrides,
});

const seedCart = (items: { product: Product; quantity: number }[]) =>
	localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

const renderCart = () =>
	render(
		<CartProvider>
			<MemoryRouter>
				<Cart />
			</MemoryRouter>
		</CartProvider>,
	);

describe("Cart page", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("shows an empty message and a back-to-home link when the cart is empty", () => {
		renderCart();

		expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
	});

	it("renders a card per product and the correct order total", () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 2 },
			{ product: makeProduct({ productId: 2, name: "B", price: 20 }), quantity: 3 },
		]);

		renderCart();

		expect(screen.getByRole("heading", { name: "A" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "B" })).toBeInTheDocument();
		// 10*2 + 20*3 = 80
		expect(screen.getByTestId("cart-total-price")).toHaveTextContent("80");
	});

	it("increasing an item's quantity updates the order total", async () => {
		seedCart([{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 }]);

		renderCart();

		expect(screen.getByTestId("cart-total-price")).toHaveTextContent("10");

		await userEvent.click(screen.getByRole("button", { name: /increase quantity/i }));

		expect(screen.getByTestId("cart-total-price")).toHaveTextContent("20");
	});

	it("removing a product drops it from the cart and updates the total", async () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 },
			{ product: makeProduct({ productId: 2, name: "B", price: 20 }), quantity: 1 },
		]);

		renderCart();

		expect(screen.getByRole("heading", { name: "A" })).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: /remove a from cart/i }));

		expect(screen.queryByRole("heading", { name: "A" })).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "B" })).toBeInTheDocument();
		expect(screen.getByTestId("cart-total-price")).toHaveTextContent("20");
	});

	it("shows a back-to-home link when there are items too", () => {
		seedCart([{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 }]);

		renderCart();

		expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
	});
});
