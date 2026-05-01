import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "./ThemeToggle";
import { ThemeContext } from "../../context/themeContextValue";

describe("ThemeToggle Component", () => {
	it("renders with aria-pressed=false in light mode", () => {
		render(
			<ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
				<ThemeToggle />
			</ThemeContext.Provider>
		);

		const button = screen.getByRole("button", { name: /toggle dark mode/i });
		expect(button).toHaveAttribute("aria-pressed", "false");
	});

	it("renders with aria-pressed=true in dark mode", () => {
		render(
			<ThemeContext.Provider value={{ theme: "dark", toggleTheme: () => {} }}>
				<ThemeToggle />
			</ThemeContext.Provider>
		);
		
		expect(screen.getByRole("button", { name: /toggle dark mode/i })).toHaveAttribute(
			"aria-pressed",
			"true"
		);
	});

	it("calls toggleTheme when clicked", async () => {
		const toggleTheme = vi.fn();
		render(
			<ThemeContext.Provider value={{ theme: "light", toggleTheme }}>
				<ThemeToggle />
			</ThemeContext.Provider>
		);

		await userEvent.click(screen.getByRole("button", { name: /toggle dark mode/i }));

		expect(toggleTheme).toHaveBeenCalledTimes(1);
	});
});
