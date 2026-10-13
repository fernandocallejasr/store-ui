import { render, screen } from "@testing-library/react";
import ProductPrice from "./ProductPrice";

describe("ProductPrice", () => {
	it("shows whole amounts with two decimals", () => {
		render(<ProductPrice price={6} />);

		expect(screen.getByText("$6.00")).toBeInTheDocument();
	});

	it("pads a single decimal", () => {
		render(<ProductPrice price={4.5} />);

		expect(screen.getByText("$4.50")).toBeInTheDocument();
	});

	it("rounds floating-point noise to the cent", () => {
		render(<ProductPrice price={0.1 + 0.2} />);

		expect(screen.getByText("$0.30")).toBeInTheDocument();
	});

	it("groups thousands", () => {
		render(<ProductPrice price={1234.5} />);

		expect(screen.getByText("$1,234.50")).toBeInTheDocument();
	});

	it("renders a single span so it can sit inside running text", () => {
		render(<ProductPrice price={9.99} />);

		expect(screen.getByText("$9.99").tagName).toBe("SPAN");
	});
});
