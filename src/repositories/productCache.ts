import type { Product } from "../components/products/types";

// Resolved values only — never promises, so a rejected in-flight request can
// never be cached and replayed. No TTL: product data is static enough for this
// app, and every getProducts call refreshes the whole map.
const cache = new Map<number, Product>();

export const getCachedProduct = (id: number): Product | undefined => cache.get(id);

export const cacheProduct = (product: Product): void => {
	cache.set(product.productId, product);
};

export const cacheProducts = (products: Product[]): void => {
	products.forEach(cacheProduct);
};

export const clearProductCache = (): void => {
	cache.clear();
};
