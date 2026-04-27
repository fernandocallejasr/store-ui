import { renderHook } from "@testing-library/react";
import { useSortProducts } from "./useSortProducts";
import type { Product } from "../components/products/types";

const products: Product[] = [
	{
		productId: 1,
		price: 5,
		imageUrl: "./a.png",
		name: "A",
		description: "first",
		popularity: "10",
	},
	{
		productId: 2,
		price: 20,
		imageUrl: "./b.png",
		name: "B",
		description: "second",
		popularity: "80",
	},
	{
		productId: 3,
		price: 10,
		imageUrl: "./c.png",
		name: "C",
		description: "third",
		popularity: "50",
	},
];

describe("useSortProducts", () => {
	it("returns the original list when the sort selection is empty", () => {
		const { result } = renderHook(() => useSortProducts(products, ""));
		expect(result.current).toBe(products);
	});

	it("sorts by price low to high", () => {
		const { result } = renderHook(() =>
			useSortProducts(products, "Price Low to High")
		);
		expect(result.current.map((p) => p.productId)).toEqual([1, 3, 2]);
	});

	it("sorts by price high to low", () => {
		const { result } = renderHook(() =>
			useSortProducts(products, "Price High to Low")
		);
		expect(result.current.map((p) => p.productId)).toEqual([2, 3, 1]);
	});

	it("sorts by popularity descending", () => {
		const { result } = renderHook(() =>
			useSortProducts(products, "Popularity")
		);
		expect(result.current.map((p) => p.productId)).toEqual([2, 3, 1]);
	});

	it("does not mutate the input array", () => {
		const original = products.map((p) => p.productId);
		renderHook(() => useSortProducts(products, "Price High to Low"));
		expect(products.map((p) => p.productId)).toEqual(original);
	});

	it("restores original order when sort selection is cleared", () => {
		const { result, rerender } = renderHook(
			({ sort }) => useSortProducts(products, sort),
			{ initialProps: { sort: "Price High to Low" } }
		);
		expect(result.current.map((p) => p.productId)).toEqual([2, 3, 1]);

		rerender({ sort: "" });
		expect(result.current).toBe(products);
	});
});
