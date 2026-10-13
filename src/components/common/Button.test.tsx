import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button", () => {
	it("is a plain button by default, so it never submits a surrounding form", () => {
		render(<Button>Save</Button>);

		expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
	});

	it("can be a submit button when asked", () => {
		render(<Button type="submit">Send</Button>);

		expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
	});

	it("calls onClick when pressed", async () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Go</Button>);

		await userEvent.click(screen.getByRole("button", { name: "Go" }));

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not call onClick while disabled", async () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick} disabled>Go</Button>);

		await userEvent.click(screen.getByRole("button", { name: "Go" }));

		expect(onClick).not.toHaveBeenCalled();
	});

	it("keeps an explicit accessible name over its visible text", () => {
		render(<Button aria-label="Add Blue Sticker to cart">Add</Button>);

		expect(screen.getByRole("button", { name: "Add Blue Sticker to cart" })).toBeInTheDocument();
	});
});
