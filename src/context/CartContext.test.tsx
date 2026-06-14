import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "./CartContext";
import { useCart } from "./useCart";
import { CART_STORAGE_KEY } from "./cartContextValue";
import type { Product } from "../components/products/types";

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
	productId: 1,
	price: 10,
	imageUrl: "https://example.com/p.png",
	name: "Test Product",
	description: "A product",
	popularity: "high",
	...overrides,
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<CartProvider>{children}</CartProvider>
);

describe("CartProvider + useCart", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("useCart returns a safe default when used outside the provider", async () => {
		const Probe = () => {
			const { totalQuantity, addToCart } = useCart();
			return (
				<button onClick={() => addToCart(makeProduct())}>
					{totalQuantity}
				</button>
			);
		};

		render(<Probe />);

		const button = screen.getByRole("button");
		expect(button).toHaveTextContent("0");
		await userEvent.click(button);
		// No provider => no-op, count stays 0.
		expect(button).toHaveTextContent("0");
	});

	it("starts empty", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		expect(result.current.cart).toEqual([]);
		expect(result.current.totalQuantity).toBe(0);
	});

	it("addToCart adds a new line with quantity 1 by default", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		expect(result.current.cart).toHaveLength(1);
		expect(result.current.cart[0].quantity).toBe(1);
		expect(result.current.totalQuantity).toBe(1);
	});

	it("addToCart bumps quantity for an existing product", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		expect(result.current.cart).toHaveLength(1);
		expect(result.current.cart[0].quantity).toBe(2);
		expect(result.current.totalQuantity).toBe(2);
	});

	it("addToCart accepts an explicit quantity", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 }), 3));
		expect(result.current.cart[0].quantity).toBe(3);
		expect(result.current.totalQuantity).toBe(3);
	});

	it("removeFromCart removes the whole line", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 }), 2));
		act(() => result.current.addToCart(makeProduct({ productId: 2 })));
		act(() => result.current.removeFromCart(1));
		expect(result.current.cart).toHaveLength(1);
		expect(result.current.cart[0].product.productId).toBe(2);
		expect(result.current.totalQuantity).toBe(1);
	});

	it("updateQuantity sets the quantity for a line", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		act(() => result.current.updateQuantity(1, 5));
		expect(result.current.cart[0].quantity).toBe(5);
		expect(result.current.totalQuantity).toBe(5);
	});

	it("updateQuantity to 0 (or less) removes the line", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		act(() => result.current.updateQuantity(1, 0));
		expect(result.current.cart).toHaveLength(0);
		expect(result.current.totalQuantity).toBe(0);
	});

	it("clearCart empties the cart", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 })));
		act(() => result.current.addToCart(makeProduct({ productId: 2 })));
		act(() => result.current.clearCart());
		expect(result.current.cart).toEqual([]);
		expect(result.current.totalQuantity).toBe(0);
	});

	it("persists the cart to localStorage on change", () => {
		const { result } = renderHook(() => useCart(), { wrapper });
		act(() => result.current.addToCart(makeProduct({ productId: 1 }), 2));

		const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)!);
		expect(stored).toHaveLength(1);
		expect(stored[0].product.productId).toBe(1);
		expect(stored[0].quantity).toBe(2);
	});

	it("hydrates the cart from localStorage on mount", () => {
		localStorage.setItem(
			CART_STORAGE_KEY,
			JSON.stringify([{ product: makeProduct({ productId: 7 }), quantity: 4 }]),
		);

		const { result } = renderHook(() => useCart(), { wrapper });
		expect(result.current.cart).toHaveLength(1);
		expect(result.current.cart[0].product.productId).toBe(7);
		expect(result.current.totalQuantity).toBe(4);
	});

	it("falls back to an empty cart when localStorage is corrupted", () => {
		localStorage.setItem(CART_STORAGE_KEY, "not valid json{{{");
		const { result } = renderHook(() => useCart(), { wrapper });
		expect(result.current.cart).toEqual([]);
	});
});
