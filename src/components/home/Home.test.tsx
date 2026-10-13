import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import Home from "./Home";
import type { Product } from "../products/types";

const mockProducts: Product[] = [
	{ productId: 1, price: 5, imageUrl: "/a.png", name: "Sticker A", description: "", popularity: "80" },
	{ productId: 2, price: 7, imageUrl: "/b.png", name: "Sticker B", description: "", popularity: "20" },
];

const renderHome = (loader: () => unknown = () => mockProducts) => {
	const router = createMemoryRouter(
		[{ path: "/", element: <Home />, loader }],
		{ initialEntries: ["/"] },
	);
	return render(<RouterProvider router={router} />);
};

describe("Home", () => {
	it("leads with the hero headline", async () => {
		renderHome();

		expect(
			await screen.findByRole("heading", { level: 1, name: "Small stickers. Strong opinions." }),
		).toBeInTheDocument();
	});

	it("sums up the catalogue from the loaded products", async () => {
		renderHome();

		expect(await screen.findByText(/coding jokes/i)).toHaveTextContent("2 designs, from $5.00.");
	});

	it("uses the singular for a single design", async () => {
		renderHome(() => [mockProducts[1]]);

		expect(await screen.findByText(/coding jokes/i)).toHaveTextContent("1 design, from $7.00.");
	});

	it("leaves the summary out when there are no products", async () => {
		renderHome(() => []);

		const subtext = await screen.findByText(/coding jokes/i);

		expect(subtext).toHaveTextContent("Coding jokes, anime heroes, sports legends and moody cats.");
		expect(subtext).not.toHaveTextContent(/design/);
	});

	it("points Browse stickers at the catalogue section", async () => {
		renderHome();

		expect(await screen.findByRole("link", { name: "Browse stickers" })).toHaveAttribute("href", "#stickers");
		expect(document.getElementById("stickers")).toContainElement(
			screen.getByRole("heading", { level: 2, name: "All stickers" }),
		);
	});

	it("renders a card per loaded product", async () => {
		renderHome();

		expect(await screen.findAllByRole("heading", { level: 3 })).toHaveLength(2);
	});
});
