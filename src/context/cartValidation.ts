import type { CartItem } from "./cartContextValue";
import type { Product } from "../components/products/types";

interface QuantityRule {
	allowZero?: boolean;
}

export const isValidQuantity = (
	quantity: unknown,
	{ allowZero = false }: QuantityRule = {},
): quantity is number => {
	if (typeof quantity !== "number" || !Number.isInteger(quantity))
		return false;

	return allowZero ? quantity >= 0 : quantity > 0;
};

const isValidProduct = (value: unknown): value is Product => {
	if (typeof value !== "object" || value === null)
		return false;

	const product = value as Record<string, unknown>;

	return (
		typeof product.productId === "number" &&
		typeof product.price === "number" &&
		typeof product.imageUrl === "string" &&
		typeof product.name === "string" &&
		typeof product.description === "string" &&
		typeof product.popularity === "string"
	);
};

const isValidCartItem = (value: unknown): value is CartItem => {
	if (typeof value !== "object" || value === null)
		return false;

	const item = value as Record<string, unknown>;

	return isValidProduct(item.product) && isValidQuantity(item.quantity);
};

// Trust boundary: localStorage is untrusted input (a user can edit it, an old
// app version may have written a different shape). Parse it into genuinely-typed
// CartItem[] rather than asserting `as CartItem[]`, dropping any item that fails
// validation so one bad entry can't corrupt the whole cart.
export const parseStoredCart = (raw: string | null): CartItem[] => {
	if (!raw)
		return [];

	try {
		const parsed: unknown = JSON.parse(raw);

		if (!Array.isArray(parsed))
			return [];

		return parsed.filter(isValidCartItem);
	} catch {
		return [];
	}
};
