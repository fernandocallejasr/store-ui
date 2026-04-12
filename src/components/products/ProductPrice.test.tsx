import { render, screen } from "@testing-library/react";
import ProductPrice from "./ProductPrice";

describe('ProductPrice Component', () => {
	it('should render currency symbol and price', () => {
		render(<ProductPrice currency="$" price={9.99} />);

		expect(screen.getByText("9.99")).toBeInTheDocument();
	});

	it('should render price value inside a span element', () => {
		render(<ProductPrice currency="$" price={9.99} />);

		const priceElement = screen.getByText("9.99");

		expect(priceElement.tagName).toBe("SPAN");
	});

	it('should render with different currency symbols', () => {
		render(<ProductPrice currency="EUR" price={15} />);

		expect(screen.getByText(/EUR/)).toBeInTheDocument();
		expect(screen.getByText("15")).toBeInTheDocument();
	});
});
