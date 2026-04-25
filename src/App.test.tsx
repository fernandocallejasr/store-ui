import { render, screen } from '@testing-library/react'
import App from './App';
import { getProducts } from './repositories/productRepository';
import type { Product } from './components/products/types';

const mockProducts: Product[] = [
	{ productId: 1, price: 5, imageUrl: "/a.png", name: "Sticker A", description: "", popularity: "high" },
	{ productId: 2, price: 7, imageUrl: "/b.png", name: "Sticker B", description: "", popularity: "low" }
];

vi.mock("./repositories/productRepository", () => ({
	getProducts: vi.fn(),
}));

beforeEach(() => {
	vi.mocked(getProducts).mockResolvedValue(mockProducts);
});

describe('App Component', () => {
	it('should render main title', () => {
		render(<App />);

		const mainTitle = screen.getByText(/Stickers Shop/i);

		expect(mainTitle).toBeInTheDocument();
	});

	it('should render header', () => {
		render(<App />);

		const header = screen.getByRole('banner');

		expect(header).toBeInTheDocument();
	});

	it('should render footer', () => {
		render(<App />);

		const footer = screen.getByRole('contentinfo');

		expect(footer).toBeInTheDocument();
	});

	it('should render product listings', async () => {
		render(<App />);

		const productHeadings = await screen.findAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBeGreaterThan(0);
	});
});
