import { isValidQuantity, parseStoredCart } from "./cartValidation";
import { CART_STORAGE_KEY, type CartItem } from "./cartContextValue";
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

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
	product: makeProduct(),
	quantity: 1,
	...overrides,
});

describe("isValidQuantity", () => {
	it("accepts positive whole numbers", () => {
		expect(isValidQuantity(1)).toBe(true);
		expect(isValidQuantity(42)).toBe(true);
	});

	it.each([0, -1, 2.5, NaN, Infinity, -Infinity, "3", null, undefined])(
		"rejects %p by default",
		(value) => {
			expect(isValidQuantity(value)).toBe(false);
		},
	);

	it("accepts 0 when allowZero is set, but still rejects negatives and non-integers", () => {
		expect(isValidQuantity(0, { allowZero: true })).toBe(true);
		expect(isValidQuantity(3, { allowZero: true })).toBe(true);
		expect(isValidQuantity(-1, { allowZero: true })).toBe(false);
		expect(isValidQuantity(1.5, { allowZero: true })).toBe(false);
		expect(isValidQuantity(NaN, { allowZero: true })).toBe(false);
	});
});

describe("parseStoredCart", () => {
	it("returns an empty array for null or empty input", () => {
		expect(parseStoredCart(null)).toEqual([]);
		expect(parseStoredCart("")).toEqual([]);
	});

	it("returns an empty array for corrupted JSON", () => {
		expect(parseStoredCart("not valid json{{{")).toEqual([]);
	});

	it("returns an empty array when the JSON is not an array", () => {
		expect(parseStoredCart(JSON.stringify({ product: makeProduct(), quantity: 1 }))).toEqual([]);
		expect(parseStoredCart(JSON.stringify("hello"))).toEqual([]);
	});

	it("keeps valid items", () => {
		const items = [makeItem({ quantity: 2 }), makeItem({ product: makeProduct({ productId: 2 }) })];
		expect(parseStoredCart(JSON.stringify(items))).toHaveLength(2);
	});

	it("drops items with an invalid quantity (0, negative, fractional, NaN-ish)", () => {
		const stored = [
			makeItem({ quantity: 0 }),
			makeItem({ product: makeProduct({ productId: 2 }), quantity: -3 }),
			makeItem({ product: makeProduct({ productId: 3 }), quantity: 1.5 }),
		];
		expect(parseStoredCart(JSON.stringify(stored))).toEqual([]);
	});

	it("drops items with a missing or malformed product", () => {
		const stored = [
			{ quantity: 1 },
			{ product: { name: "no id" }, quantity: 1 },
			{ product: null, quantity: 1 },
		];
		expect(parseStoredCart(JSON.stringify(stored))).toEqual([]);
	});

	it("keeps valid items while dropping invalid ones in the same cart", () => {
		const stored = [
			makeItem({ product: makeProduct({ productId: 1 }), quantity: 2 }),
			makeItem({ product: makeProduct({ productId: 2 }), quantity: -1 }),
			{ garbage: true },
			makeItem({ product: makeProduct({ productId: 3 }), quantity: 5 }),
		];
		const result = parseStoredCart(JSON.stringify(stored));
		expect(result).toHaveLength(2);
		expect(result.map((item) => item.product.productId)).toEqual([1, 3]);
	});

	it("parses a cart written under the real storage key", () => {
		// Sanity check that the shape matches what the provider persists.
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([makeItem({ quantity: 4 })]));
		const result = parseStoredCart(localStorage.getItem(CART_STORAGE_KEY));
		expect(result).toHaveLength(1);
		expect(result[0].quantity).toBe(4);
		localStorage.clear();
	});
});
