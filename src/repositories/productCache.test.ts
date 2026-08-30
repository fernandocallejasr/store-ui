import {
	cacheProduct,
	cacheProducts,
	clearProductCache,
	getCachedProduct,
} from "./productCache";
import type { Product } from "../components/products/types";

const makeProduct = (id: number): Product => ({
	productId: id,
	price: 10,
	imageUrl: "/p.png",
	name: `Product ${id}`,
	description: "",
	popularity: "high",
});

describe("productCache", () => {
	beforeEach(() => {
		clearProductCache();
	});

	it("returns undefined for an id that was never cached", () => {
		expect(getCachedProduct(1)).toBeUndefined();
	});

	it("returns a product that was cached individually", () => {
		cacheProduct(makeProduct(1));

		expect(getCachedProduct(1)?.productId).toBe(1);
	});

	it("caches every product in a list", () => {
		cacheProducts([makeProduct(1), makeProduct(2)]);

		expect(getCachedProduct(1)?.productId).toBe(1);
		expect(getCachedProduct(2)?.productId).toBe(2);
	});

	it("overwrites an existing entry with the newer product", () => {
		cacheProduct(makeProduct(1));
		cacheProduct({ ...makeProduct(1), name: "Renamed" });

		expect(getCachedProduct(1)?.name).toBe("Renamed");
	});

	it("clearProductCache empties the cache", () => {
		cacheProducts([makeProduct(1), makeProduct(2)]);
		clearProductCache();

		expect(getCachedProduct(1)).toBeUndefined();
		expect(getCachedProduct(2)).toBeUndefined();
	});
});
