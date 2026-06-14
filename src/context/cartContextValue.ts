import { createContext } from "react";
import type { Product } from "../components/products/types";

export const CART_STORAGE_KEY = "cart";

export interface CartItem {
	product: Product;
	quantity: number;
}

export interface CartContextValue {
	cart: CartItem[];
	addToCart: (product: Product, quantity?: number) => void;
	removeFromCart: (productId: number) => void;
	updateQuantity: (productId: number, quantity: number) => void;
	clearCart: () => void;
	totalQuantity: number;
}

export const CartContext = createContext<CartContextValue>({
	cart: [],
	addToCart: () => {},
	removeFromCart: () => {},
	updateQuantity: () => {},
	clearCart: () => {},
	totalQuantity: 0,
});
