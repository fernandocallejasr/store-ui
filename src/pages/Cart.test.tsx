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

	it("shows an empty message and a way back to the catalogue when the cart is empty", () => {
		renderCart();

		expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Browse stickers" })).toHaveAttribute("href", "/");
	});

	it("counts the items in the heading", () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A" }), quantity: 2 },
			{ product: makeProduct({ productId: 2, name: "B" }), quantity: 1 },
		]);

		renderCart();

		expect(screen.getByRole("heading", { level: 1, name: /your cart/i })).toBeInTheDocument();
		expect(screen.getByText("3 items")).toBeInTheDocument();
	});

	it("uses the singular for a single item", () => {
		seedCart([{ product: makeProduct({ productId: 1, name: "A" }), quantity: 1 }]);

		renderCart();

		expect(screen.getByText("1 item")).toBeInTheDocument();
	});

	it("lists one entry per product, with the correct order total", () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 2 },
			{ product: makeProduct({ productId: 2, name: "B", price: 20 }), quantity: 3 },
		]);

		renderCart();

		expect(screen.getAllByRole("listitem")).toHaveLength(2);
		expect(screen.getByRole("heading", { name: "A" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "B" })).toBeInTheDocument();
		// 10*2 + 20*3 = 80
		expect(screen.getByTestId("cart-total-price")).toHaveTextContent(/^\$80\.00$/);
	});

	it("adds up prices to the cent", () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A", price: 0.1 }), quantity: 1 },
			{ product: makeProduct({ productId: 2, name: "B", price: 0.2 }), quantity: 1 },
		]);

		renderCart();

		expect(screen.getByTestId("cart-total-price")).toHaveTextContent(/^\$0\.30$/);
	});

	it("increasing an item's quantity updates the order total", async () => {
		seedCart([{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 }]);

		renderCart();

		expect(screen.getByTestId("cart-total-price")).toHaveTextContent(/^\$10\.00$/);

		await userEvent.click(screen.getByRole("button", { name: /increase quantity/i }));

		expect(screen.getByTestId("cart-total-price")).toHaveTextContent(/^\$20\.00$/);
	});

	it("removing a product drops it from the cart and updates the total", async () => {
		seedCart([
			{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 },
			{ product: makeProduct({ productId: 2, name: "B", price: 20 }), quantity: 1 },
		]);

		renderCart();

		await userEvent.click(screen.getByRole("button", { name: /remove a from cart/i }));

		expect(screen.queryByRole("heading", { name: "A" })).not.toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "B" })).toBeInTheDocument();
		expect(screen.getByTestId("cart-total-price")).toHaveTextContent(/^\$20\.00$/);
	});

	it("offers Continue shopping when there are items", () => {
		seedCart([{ product: makeProduct({ productId: 1, name: "A", price: 10 }), quantity: 1 }]);

		renderCart();

		expect(screen.getByRole("link", { name: "Continue shopping" })).toHaveAttribute("href", "/");
	});
});
