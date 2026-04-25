import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { getProducts } from "../../repositories/productRepository";
import type { Product } from "../products/types";

const mockProducts: Product[] = [
	{ productId: 1, price: 5, imageUrl: "/a.png", name: "Sticker A", description: "", popularity: "high" },
	{ productId: 2, price: 7, imageUrl: "/b.png", name: "Sticker B", description: "", popularity: "low" }
];

vi.mock("../../repositories/productRepository", () => ({
	getProducts: vi.fn(),
}));

beforeEach(() => {
	vi.mocked(getProducts).mockResolvedValue(mockProducts);
});

describe('Home Component', () => {
	it('should render the page heading', () => {
		render(<Home />);

		expect(screen.getByText("My Page Heading")).toBeInTheDocument();
	});

	it('should render the descriptive paragraph', () => {
		render(<Home />);

		expect(screen.getByText(/Add a touch of creativity/i)).toBeInTheDocument();
	});

	it('should render product listings', async () => {
		render(<Home />);

		const productHeadings = await screen.findAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBeGreaterThan(0);
	});
});
