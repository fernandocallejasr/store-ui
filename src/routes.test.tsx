import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./routes";

vi.mock("./repositories/productRepository", () => ({
	getProducts: vi.fn().mockResolvedValue([]),
}));

const renderAt = (path: string) => {
	const router = createMemoryRouter(routes, { initialEntries: [path] });
	return render(<RouterProvider router={router} />);
};

describe("App routing", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("renders the About page at /about", async () => {
		renderAt("/about");

		expect(
			await screen.findByText("About", { selector: "div" }),
		).toBeInTheDocument();
	});

	it("renders the Cart page at /cart", async () => {
		renderAt("/cart");

		expect(
			await screen.findByText("Cart", { selector: "div" }),
		).toBeInTheDocument();
	});

	it("redirects /home to the index route", async () => {
		renderAt("/home");

		expect(await screen.findByText("My Page Heading")).toBeInTheDocument();
	});

	it("renders the ErrorPage for unknown routes", async () => {
		renderAt("/totally-not-a-route");

		expect(
			await screen.findByRole("heading", { name: /page not found/i }),
		).toBeInTheDocument();
	});
});
