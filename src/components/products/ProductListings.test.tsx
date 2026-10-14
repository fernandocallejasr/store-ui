import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Fake timers make the 200ms search debounce deterministic.
const user = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

const passDebounce = () =>
	act(() => {
		vi.advanceTimersByTime(250);
	});

const typeSearch = async (text: string) => {
	await user().type(screen.getByRole("searchbox"), text);
	passDebounce();
};

describe('ProductListings Component', () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should render product cards for each product', () => {
		renderListings(mockProducts);

		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
	});

	it('should render each product name', () => {
		renderListings(mockProducts);

		expect(screen.getByText("Sticker Alpha")).toBeInTheDocument();
		expect(screen.getByText("Sticker Beta")).toBeInTheDocument();
	});

	it('heads the catalogue and counts it', () => {
		renderListings(mockProducts);

		expect(screen.getByRole('heading', { level: 2, name: "All stickers" })).toBeInTheDocument();
		expect(screen.getByText("2 stickers")).toBeInTheDocument();
	});

	it('uses the singular for a one-sticker catalogue', () => {
		renderListings([mockProducts[0]]);

		expect(screen.getByText("1 sticker")).toBeInTheDocument();
	});

	it('labels the sort options in sentence case', () => {
		renderListings(mockProducts);

		const labels = within(screen.getByLabelText("Sort by"))
			.getAllByRole("option")
			.map((option) => option.textContent);

		expect(labels).toEqual(["Featured", "Most popular", "Price: low to high", "Price: high to low"]);
	});

	it('reports how many stickers match a search', async () => {
		renderListings(mockProducts);

		await typeSearch("alpha");

		const count = screen.getByText('1 of 2 match "alpha"');
		// Announced politely, and deliberately not role="status", which belongs to the loading view.
		expect(count).toHaveAttribute("aria-live", "polite");
		expect(count).not.toHaveAttribute("role", "status");
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(1);
	});

	it('ignores whitespace around the search', async () => {
		renderListings(mockProducts);

		await typeSearch("  alpha  ");

		expect(screen.getByText('1 of 2 match "alpha"')).toBeInTheDocument();
	});

	it('treats a whitespace-only search as no search', async () => {
		renderListings(mockProducts);

		await typeSearch("   ");

		expect(screen.getByText("2 stickers")).toBeInTheDocument();
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
	});

	it('says when nothing matches and offers to clear the search', async () => {
		renderListings(mockProducts);
		await typeSearch("zzz");

		expect(screen.getByText('No stickers match "zzz".')).toBeInTheDocument();

		await user().click(screen.getByRole("button", { name: "Clear search" }));
		passDebounce();

		expect(screen.getByRole("searchbox")).toHaveValue("");
		expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
	});

	it('returns focus to the search box after clearing, instead of dropping it when the button goes', async () => {
		renderListings(mockProducts);
		await typeSearch("zzz");

		await user().click(screen.getByRole("button", { name: "Clear search" }));
		passDebounce();

		expect(screen.getByRole("searchbox")).toHaveFocus();
	});

	it('explains an empty catalogue without offering to clear a search', () => {
		renderListings([]);

		expect(screen.getByText("No stickers are available right now.")).toBeInTheDocument();
		expect(screen.getByText("0 stickers")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
	});
});
