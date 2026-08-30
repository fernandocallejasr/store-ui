import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Home from "./Home";
import type { Product } from "../products/types";

const mockProducts: Product[] = [
	{ productId: 1, price: 5, imageUrl: "/a.png", name: "Sticker A", description: "", popularity: "high" },
	{ productId: 2, price: 7, imageUrl: "/b.png", name: "Sticker B", description: "", popularity: "low" }
];

const renderHome = (loader: () => unknown = () => mockProducts) => {
	const router = createMemoryRouter(
		[{ path: "/", element: <Home />, loader }],
		{ initialEntries: ["/"] },
	);
	return render(<RouterProvider router={router} />);
};

describe('Home Component', () => {
	it('should render the page heading', async () => {
		renderHome();

		expect(await screen.findByText("My Page Heading")).toBeInTheDocument();
	});

	it('should render the descriptive paragraph', async () => {
		renderHome();

		expect(await screen.findByText(/Add a touch of creativity/i)).toBeInTheDocument();
	});

	it('should render product listings from loader data', async () => {
		renderHome();

		const productHeadings = await screen.findAllByRole('heading', { level: 2 });

		expect(productHeadings.length).toBe(2);
	});
});
