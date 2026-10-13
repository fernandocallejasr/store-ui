import type { Product } from "../products/types";
import { summarizeCatalog } from "./catalogSummary";

const product = (overrides: Partial<Product>): Product => ({
	productId: 1,
	price: 5,
	imageUrl: "/a.png",
	name: "A",
	description: "",
	popularity: "0",
	...overrides,
});

describe("summarizeCatalog", () => {
	it("counts the products and finds the lowest price", () => {
		const summary = summarizeCatalog([
			product({ productId: 1, price: 6 }),
			product({ productId: 2, price: 2 }),
			product({ productId: 3, price: 4.5 }),
		]);

		expect(summary.count).toBe(3);
		expect(summary.minPrice).toBe(2);
	});

	it("features the three most popular products, most popular first", () => {
		const summary = summarizeCatalog([
			product({ productId: 1, popularity: "10" }),
			product({ productId: 2, popularity: "90" }),
			product({ productId: 3, popularity: "40" }),
			product({ productId: 4, popularity: "70" }),
		]);

		expect(summary.featured.map((p) => p.productId)).toEqual([2, 4, 3]);
	});

	it("ranks a popularity that is not a number below every numeric one, in original order", () => {
		const summary = summarizeCatalog([
			product({ productId: 1, popularity: "high" }),
			product({ productId: 2, popularity: "5" }),
			product({ productId: 3, popularity: "" }),
		]);

		expect(summary.featured.map((p) => p.productId)).toEqual([2, 1, 3]);
	});

	it("features fewer than three when the catalogue is smaller", () => {
		expect(summarizeCatalog([product({})]).featured).toHaveLength(1);
	});

	it("summarizes an empty catalogue without a price", () => {
		expect(summarizeCatalog([])).toEqual({ count: 0, minPrice: null, featured: [] });
	});

	it("leaves the caller's array in its original order", () => {
		const products = [
			product({ productId: 1, popularity: "1" }),
			product({ productId: 2, popularity: "9" }),
		];

		summarizeCatalog(products);

		expect(products.map((p) => p.productId)).toEqual([1, 2]);
	});
});
