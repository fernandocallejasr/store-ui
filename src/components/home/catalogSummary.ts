import type { Product } from "../products/types";

export interface CatalogSummary {
	count: number;
	minPrice: number | null;
	featured: Product[];
}

const FEATURED_COUNT = 3;

// The API types popularity as a string. Anything that is not a number ranks
// below every real score instead of scrambling the order with NaN comparisons.
const popularityOf = (product: Product) => {
	const value = Number.parseFloat(product.popularity);
	return Number.isNaN(value) ? Number.NEGATIVE_INFINITY : value;
};

export const summarizeCatalog = (products: Product[]): CatalogSummary => ({
	count: products.length,
	minPrice: products.length > 0 ? Math.min(...products.map((product) => product.price)) : null,
	featured: [...products]
		.sort((a, b) => popularityOf(b) - popularityOf(a))
		.slice(0, FEATURED_COUNT),
});
