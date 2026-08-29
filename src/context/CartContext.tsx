import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CartContext, CART_STORAGE_KEY, type CartItem } from "./cartContextValue";
import { isValidQuantity, parseStoredCart } from "./cartValidation";
import type { Product } from "../components/products/types";

const warnInvalidQuantity = (method: string, quantity: number) => {
	if (import.meta.env.DEV)
		console.warn(`[cart] ${method}: ignored invalid quantity`, quantity);
};

const getInitialCart = (): CartItem[] => {
	if (typeof window === "undefined")
		return [];

	return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
};

const persistCart = (cart: CartItem[]) => {
	try {
		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	} catch (error) {
		if (import.meta.env.DEV)
			console.warn("[cart] could not persist cart to localStorage", error);
	}
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<CartItem[]>(getInitialCart);

	useEffect(() => {
		persistCart(cart);
	}, [cart]);

	const addToCart = useCallback((product: Product, quantity = 1) => {
		if (!isValidQuantity(quantity)) {
			warnInvalidQuantity("addToCart", quantity);
			return;
		}

		setCart((prev) => {
			const existing = prev.find((item) => item.product.productId === product.productId);

			if (existing)
				return prev.map((item) => (
					item.product.productId === product.productId
						? { ...item, quantity: item.quantity + quantity }
						: item
				));

			return [...prev, { product, quantity }];
		});
	}, []);

	const removeFromCart = useCallback((productId: number) => {
		setCart((prev) => prev.filter((item) => item.product.productId !== productId));
	}, []);

	const updateQuantity = useCallback((productId: number, quantity: number) => {
		if (!isValidQuantity(quantity, { allowZero: true })) {
			warnInvalidQuantity("updateQuantity", quantity);
			return;
		}

		setCart((prev) => {
			if (quantity === 0)
				return prev.filter((item) => item.product.productId !== productId);

			return prev.map((item) => (
				item.product.productId === productId
					? { ...item, quantity }
					: item
			));
		});
	}, []);

	const clearCart = useCallback(() => setCart([]), []);

	const totalQuantity = useMemo(
		() => cart.reduce((sum, item) => sum + item.quantity, 0),
		[cart],
	);

	const value = useMemo(
		() => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalQuantity }),
		[cart, addToCart, removeFromCart, updateQuantity, clearCart, totalQuantity],
	);

	return (
		<CartContext.Provider value={value}>
			{children}
		</CartContext.Provider>
	);
};
