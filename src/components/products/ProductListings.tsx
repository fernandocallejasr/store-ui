import { useState } from "react";
import type { Product } from "./types";
import ProductCard from "./ProductCard";
import Dropdown, { type DropdownOption } from "../common/Dropdown";
import SearchBox from "../common/SearchBox";
import Container from "../common/Container";
import Button from "../common/Button";
import { useSortProducts } from "../../hooks/useSortProducts";
import { useSearchFilter } from "../../hooks/useSearchFilter";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

interface ProductListingsProps {
	products: Array<Product>;
};

// Labels are copy; values are what useSortProducts switches on, so they stay put.
const sortOptions: DropdownOption[] = [
	{ label: "Featured", value: "" },
	{ label: "Most popular", value: "Popularity" },
	{ label: "Price: low to high", value: "Price Low to High" },
	{ label: "Price: high to low", value: "Price High to Low" },
];

const SEARCH_FIELDS: (keyof Product)[] = ["name", "description"];
const SEARCH_DELAY_MS = 200;

const countLabel = (count: number) => `${count} ${count === 1 ? "sticker" : "stickers"}`;

const ProductListings = ({
	products
}: ProductListingsProps) => {
	const [sortOption, setSortOption] = useState<string>("");
	const [query, setQuery] = useState<string>("");

	// Debounced once, here, so the grid and the result count always describe
	// the same search.
	const searchTerm = useDebouncedValue(query, SEARCH_DELAY_MS).trim();
	const filteredProducts = useSearchFilter(products, searchTerm, SEARCH_FIELDS, 0);
	const filteredAndSortedProducts = useSortProducts(filteredProducts, sortOption);

	const summary = searchTerm === ""
		? countLabel(products.length)
		: `${filteredProducts.length} of ${products.length} match "${searchTerm}"`;

	return (
		<section id="stickers" aria-labelledby="stickers-title" className="scroll-mt-24 pb-20">
			<Container>
				<div className="flex flex-col gap-4 border-t border-slate-200 pt-10 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
					<div className="min-w-0">
						<h2
							id="stickers-title"
							className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
						>
							All stickers
						</h2>
						<p aria-live="polite" className="mt-1 break-words text-sm text-slate-600 dark:text-slate-400">
							{summary}
						</p>
					</div>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<SearchBox
							value={query}
							onChange={setQuery}
							placeholder="Search stickers…"
							ariaLabel="Search stickers"
						/>
						<Dropdown
							id="product-sort"
							label="Sort by"
							options={sortOptions}
							selectedValue={sortOption}
							handleSelection={setSortOption}
						/>
					</div>
				</div>

				{filteredAndSortedProducts.length > 0 ? (
					<ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
						{filteredAndSortedProducts.map((product) => (
							<li key={product.productId}>
								<ProductCard product={product} />
							</li>
						))}
					</ul>
				) : searchTerm === "" ? (
					<p className="mt-10 text-slate-600 dark:text-slate-400">
						No stickers are available right now.
					</p>
				) : (
					<div className="mt-10 flex flex-col items-start gap-3">
						<p className="break-words text-slate-900 dark:text-slate-100">
							No stickers match "{searchTerm}".
						</p>
						<Button variant="text" onClick={() => setQuery("")}>
							Clear search
						</Button>
					</div>
				)}
			</Container>
		</section>
	);
};

export default ProductListings;
