import { render, screen } from "@testing-library/react";
import SkipLink from "./SkipLink";

describe("SkipLink", () => {
	it("jumps to the main content", () => {
		render(<SkipLink />);

		expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
	});
});
