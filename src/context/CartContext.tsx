import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CartContext, CART_STORAGE_KEY, type CartItem } from "./cartContextValue";
import type { Product } from "../components/products/types";

const getInitialCart = (): CartItem[] => {
	if (typeof window === "undefined")
		return [];

	try {
		const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
		return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
	} catch {
		return [];
	}
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [cart, setCart] = useState<CartItem[]>(getInitialCart);

	useEffect(() => {
		window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}, [cart]);

	const addToCart = useCallback((product: Product, quantity = 1) => {
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
		setCart((prev) => {
			if (quantity <= 0)
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
