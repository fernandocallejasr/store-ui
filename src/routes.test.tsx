import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./routes";
import { getProducts } from "./repositories/productRepository";

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
		vi.mocked(getProducts).mockResolvedValue([]);
	});

	// Pins where hydrateFallbackElement lives. useNavigation() stays "idle" during
	// initial hydration, so MainLayout's pending UI cannot cover a cold load — the
	// fallback does. It sits on the index route rather than the root so that
	// MainLayout keeps rendering: on the root it would replace MainLayout itself
	// and the chrome would vanish, which this test would catch.
	it("shows the loading view with header and footer during a cold load", () => {
		vi.mocked(getProducts).mockReturnValue(new Promise(() => {}));

		renderAt("/");

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
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
			await screen.findByRole("heading", { name: /your cart/i }),
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
