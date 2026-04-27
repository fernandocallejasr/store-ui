import { useMemo } from "react";
import type { Product } from "../components/products/types";


export function useSortProducts(products: Product[], sortSelection: string): Product[] {
	return useMemo(() => {
		switch (sortSelection) {
			case "":
				return products;
			case "Price High to Low":
				return [...products].sort((a, b) => b.price - a.price);
			case "Price Low to High":
				return [...products].sort((a, b) => a.price - b.price);
			case "Popularity":
				return [...products].sort((a: Product, b: Product) => parseInt(b.popularity, 10) - parseInt(a.popularity, 10));
		}

		return products;
	}, [sortSelection, products]);
};