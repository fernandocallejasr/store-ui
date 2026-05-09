import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Product } from "./types";
import ProductCard from "./ProductCard";

const testProduct: Product = {
	productId: 13,
	price: 89,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "Popularity"
}

const renderCard = (product: Product = testProduct) =>
	render(
		<MemoryRouter>
			<ProductCard product={product} />
		</MemoryRouter>
	);

describe('Product Card', () => {
	it('should render product image with correct alt text', () => {
		renderCard();

		const imageElement = screen.getByRole('img');

		expect(imageElement).toBeInTheDocument();

		expect(imageElement).toHaveAttribute('src', expect.stringContaining('mockUrl'));
		expect(imageElement).toHaveAttribute('alt', expect.stringContaining(testProduct.name));
	});

	it('should render product title in heading element', () => {
		renderCard();

		const h2Element = screen.getByRole('heading', { level: 2 });

		expect(h2Element).toBeInTheDocument();
		expect(h2Element).toHaveTextContent(testProduct.name);
	});

	it('should render product description', () => {
		renderCard();

		const description = screen.getByText(testProduct.description);

		expect(description).toBeInTheDocument();
	});

	it('should render product price', () => {
		renderCard();

		const price = screen.getByText(testProduct.price.toString());

		expect(price).toBeInTheDocument();
	});
});
