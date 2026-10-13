import { render, screen } from "@testing-library/react";
import Container from "./Container";

describe("Container", () => {
	it("renders its children", () => {
		render(<Container><p>Inside</p></Container>);

		expect(screen.getByText("Inside")).toBeInTheDocument();
	});

	it("keeps the page width and adds the caller's classes", () => {
		render(<Container className="py-8"><p>Inside</p></Container>);

		const wrapper = screen.getByText("Inside").parentElement!;

		expect(wrapper).toHaveClass("max-w-6xl", "mx-auto", "py-8");
	});
});
