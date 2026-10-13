import { render, screen } from "@testing-library/react";
import Contact from "./Contact";

describe("Contact page", () => {
	it("has a page heading", () => {
		render(<Contact />);

		expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
	});

	it.each([
		["GitHub", "https://github.com/fernandocallejasr"],
		["LinkedIn", "https://www.linkedin.com/in/fernando-callejas/"],
	])("links to %s in a new tab and says so", (label, href) => {
		render(<Contact />);

		// jsdom applies no CSS, so the block spans join without spaces in the
		// computed name ("GitHubgithub.com/..."); match the ends, not word breaks.
		const link = screen.getByRole("link", {
			name: new RegExp(`^${label}.*\\(opens in new tab\\)$`),
		});

		expect(link).toHaveAttribute("href", href);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("shows each handle", () => {
		render(<Contact />);

		expect(screen.getByText("github.com/fernandocallejasr")).toBeInTheDocument();
		expect(screen.getByText("linkedin.com/in/fernando-callejas")).toBeInTheDocument();
	});
});
