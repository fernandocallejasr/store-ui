import { render, screen } from "@testing-library/react";
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

describe('ProductListings Component', () => {
	it('should render product cards for each product', () => {
		render(<ProductListings products={mockProducts} />);

		const headings = screen.getAllByRole('heading', { level: 2 });

		expect(headings).toHaveLength(2);
	});

	it('should render each product name', () => {
		render(<ProductListings products={mockProducts} />);

		expect(screen.getByText("Sticker Alpha")).toBeInTheDocument();
		expect(screen.getByText("Sticker Beta")).toBeInTheDocument();
	});

	it('should render No products found when products array is empty', () => {
		render(<ProductListings products={[]} />);

		expect(screen.getByText("No products found")).toBeInTheDocument();
	});

	it('should not render No products found when products exist', () => {
		render(<ProductListings products={mockProducts} />);

		expect(screen.queryByText("No products found")).not.toBeInTheDocument();
	});
});
