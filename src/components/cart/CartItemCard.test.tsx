import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import type { CartItem } from "../../context/cartContextValue";
import type { Product } from "../products/types";
import CartItemCard from "./CartItemCard";

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
	productId: 1,
	price: 25,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "high",
	...overrides,
});

const makeItem = (overrides: Partial<CartItem> = {}): CartItem => ({
	product: makeProduct(),
	quantity: 3,
	...overrides,
});

const renderCard = (item: CartItem = makeItem()) =>
	render(
		<CartProvider>
			<MemoryRouter>
				<CartItemCard item={item} />
			</MemoryRouter>
		</CartProvider>,
	);

describe("CartItemCard", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("renders the product image with alt text", () => {
		renderCard();

		const image = screen.getByRole("img");
		expect(image).toHaveAttribute("src", expect.stringContaining("mockUrl"));
		expect(image).toHaveAttribute("alt", expect.stringContaining("Fake Product"));
	});

	it("renders the product name", () => {
		renderCard();
		expect(screen.getByRole("heading", { name: "Fake Product" })).toBeInTheDocument();
	});

	it("links the product image to its details page", () => {
		renderCard(makeItem({ product: makeProduct({ productId: 7 }) }));

		const link = screen.getByRole("link", { name: /view details for/i });
		expect(link).toHaveAttribute("href", "/products/7");
		expect(link).toContainElement(screen.getByRole("img"));
	});

	it("renders the unit price and the line subtotal (price x quantity)", () => {
		renderCard(makeItem({ product: makeProduct({ price: 25 }), quantity: 3 }));

		expect(screen.getByText("$25.00")).toBeInTheDocument();
		expect(screen.getByTestId("line-subtotal")).toHaveTextContent("$75.00");
	});

	it("makes the line total unambiguous: shows the quantity x unit breakdown and a labelled subtotal", () => {
		renderCard(makeItem({ product: makeProduct({ price: 25 }), quantity: 3 }));

		expect(screen.getByTestId("line-breakdown")).toHaveTextContent("3 × $25.00");
		expect(screen.getByText("Subtotal")).toBeInTheDocument();
	});

	it("renders the stepper at the item's quantity", () => {
		renderCard(makeItem({ quantity: 4 }));
		expect(screen.getByTestId("quantity")).toHaveTextContent("4");
	});

	it("renders a Remove button for the product", () => {
		renderCard();
		expect(
			screen.getByRole("button", { name: /remove fake product from cart/i }),
		).toBeInTheDocument();
	});
});
