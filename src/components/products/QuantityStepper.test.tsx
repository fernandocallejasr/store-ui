import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantityStepper from "./QuantityStepper";

describe("QuantityStepper", () => {
	it("renders the current value", () => {
		render(<QuantityStepper value={3} onIncrement={() => {}} onDecrement={() => {}} />);
		expect(screen.getByTestId("quantity")).toHaveTextContent("3");
	});

	it("calls onIncrement when the + button is clicked", async () => {
		const onIncrement = vi.fn();
		render(<QuantityStepper value={1} onIncrement={onIncrement} onDecrement={() => {}} />);

		await userEvent.click(screen.getByRole("button", { name: /increase quantity/i }));

		expect(onIncrement).toHaveBeenCalledTimes(1);
	});

	it("calls onDecrement when the - button is clicked", async () => {
		const onDecrement = vi.fn();
		render(<QuantityStepper value={2} onIncrement={() => {}} onDecrement={onDecrement} />);

		await userEvent.click(screen.getByRole("button", { name: /decrease quantity/i }));

		expect(onDecrement).toHaveBeenCalledTimes(1);
	});

	it("disables the decrease button at the minimum (default 1)", () => {
		render(<QuantityStepper value={1} onIncrement={() => {}} onDecrement={() => {}} />);
		expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeDisabled();
	});

	it("enables the decrease button above the minimum", () => {
		render(<QuantityStepper value={2} onIncrement={() => {}} onDecrement={() => {}} />);
		expect(screen.getByRole("button", { name: /decrease quantity/i })).toBeEnabled();
	});

	it("includes the label in the button aria-labels when provided", () => {
		render(
			<QuantityStepper value={2} onIncrement={() => {}} onDecrement={() => {}} label="Blue Sticker" />,
		);
		expect(
			screen.getByRole("button", { name: /increase quantity of blue sticker/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /decrease quantity of blue sticker/i }),
		).toBeInTheDocument();
	});
});
