import type { Product } from "./types";
import ProductCard from "./ProductCard";
import { useState } from "react";
import Dropdown, { type DropdownOption } from "../common/Dropdown";
import SearchBox from "../common/SearchBox";
import { useSortProducts } from "../../hooks/useSortProducts";
import { useSearchFilter } from "../../hooks/useSearchFilter";

interface ProductListingsProps {
	products: Array<Product>;
};

const sortOptions: DropdownOption[] = [
	{ label: "Default", value: "" },
	{ label: "Popularity", value: "Popularity" },
	{ label: "Price Low to High", value: "Price Low to High" },
	{ label: "Price High to Low", value: "Price High to Low" },
];

const SEARCH_FIELDS: (keyof Product)[] = ["name", "description"];

const ProductListings = ({ 
		products 
}: ProductListingsProps ) => {
	const [sortOption, setSortOption] = useState<string>("");
	const [query, setQuery] = useState<string>("");

	const filteredProducts = useSearchFilter(products, query, SEARCH_FIELDS);
	const filteredAndSortedProducts = useSortProducts(filteredProducts, sortOption);

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12 px-12">
				<SearchBox
					value={query}
					onChange={setQuery}
					placeholder="Search stickers…"
					ariaLabel="Search stickers"
				/>
				<Dropdown
					id="product-sort"
					label="Sort"
					options={sortOptions}
					selectedValue={sortOption}
					handleSelection={setSortOption}
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 py-12">
				{ filteredAndSortedProducts.length > 0 ?
					filteredAndSortedProducts.map((product) => (
						<ProductCard key={product.productId} product={product}/>
					)) :
					<p className="text-center font-primary font-bold text-lg text-primary">No products found</p>
				}
			</div>
		</div>
	);
};

export default ProductListings;