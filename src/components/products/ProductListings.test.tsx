import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Product } from "./types";
import ProductListings from "./ProductListings";

const mockProducts: Product[] = [
	{
		productId: 1,
		price: 5.00,
		imageUrl: "./mock1.png",
		name: "Sticker Alpha",
		description: "First sticker",
		popularity: "80",
	},
	{
		productId: 2,
		price: 10.00,
		imageUrl: "./mock2.png",
		name: "Sticker Beta",
		description: "Second sticker",
		popularity: "90",
	},
];

const renderListings = (products: Product[]) =>
	render(
		<MemoryRouter>
			<ProductListings products={products} />
		</MemoryRouter>
	);

describe('ProductListings Component', () => {
	it('should render product cards for each product', () => {
		renderListings(mockProducts);

		const headings = screen.getAllByRole('heading', { level: 2 });

		expect(headings).toHaveLength(2);
	});

	it('should render each product name', () => {
		renderListings(mockProducts);

		expect(screen.getByText("Sticker Alpha")).toBeInTheDocument();
		expect(screen.getByText("Sticker Beta")).toBeInTheDocument();
	});

	it('should render No products found when products array is empty', () => {
		renderListings([]);

		expect(screen.getByText("No products found")).toBeInTheDocument();
	});

	it('should not render No products found when products exist', () => {
		renderListings(mockProducts);

		expect(screen.queryByText("No products found")).not.toBeInTheDocument();
	});
});
