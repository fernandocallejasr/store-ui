import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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
	vi.mocked(getProducts).mockReset().mockResolvedValue(mockProducts);
});

const renderHome = () =>
	render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	);

describe('Home Component', () => {
	it('should render the page heading', async () => {
		renderHome();

		expect(await screen.findByText("My Page Heading")).toBeInTheDocument();
	});

	it('should render the descriptive paragraph', async () => {
		renderHome();

		expect(await screen.findByText(/Add a touch of creativity/i)).toBeInTheDocument();
	});

	it('should render product listings', async () => {
		renderHome();

		const productHeadings = await screen.findAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBeGreaterThan(0);
	});

	it('should show the loading view while products are being fetched', () => {
		// A pending promise keeps Home in the loading state for the assertion.
		vi.mocked(getProducts).mockReturnValue(new Promise(() => {}));

		renderHome();

		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.getByText(/Loading products/i)).toBeInTheDocument();
	});

	it('should show the error view when fetching products fails', async () => {
		vi.mocked(getProducts).mockRejectedValueOnce(new Error("network down"));

		renderHome();

		expect(await screen.findByRole('alert')).toBeInTheDocument();
		expect(screen.getByText(/An error occurred fetching products/i)).toBeInTheDocument();
	});

	it('should retry fetching products when the retry button is clicked', async () => {
		const user = userEvent.setup();
		vi.mocked(getProducts)
			.mockRejectedValueOnce(new Error("network down"))
			.mockResolvedValueOnce(mockProducts);

		renderHome();

		const retryButton = await screen.findByRole('button', { name: /try again/i });
		await user.click(retryButton);

		const productHeadings = await screen.findAllByRole('heading', { level: 2 });
		expect(productHeadings.length).toBeGreaterThan(0);
		expect(getProducts).toHaveBeenCalledTimes(2);
	});
});
