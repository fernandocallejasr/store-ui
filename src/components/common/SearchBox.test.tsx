import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBox from "./SearchBox";

describe("SearchBox Component", () => {
	it("renders with the provided placeholder", () => {
		render(<SearchBox value="" onChange={() => {}} placeholder="Search stickers…" />);
		expect(screen.getByPlaceholderText("Search stickers…")).toBeInTheDocument();
	});

	it("uses the default aria-label when none is provided", () => {
		render(<SearchBox value="" onChange={() => {}} />);
		expect(screen.getByLabelText("Search")).toBeInTheDocument();
	});

	it("displays the controlled value", () => {
		render(<SearchBox value="cat" onChange={() => {}} />);
		expect(screen.getByRole("searchbox")).toHaveValue("cat");
	});

	it("calls onChange with the new value when the user types", async () => {
		const handleChange = vi.fn();
		render(<SearchBox value="" onChange={handleChange} />);

		await userEvent.type(screen.getByRole("searchbox"), "a");

		expect(handleChange).toHaveBeenCalledWith("a");
	});
});
