import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropdown, { type DropdownOption } from "./Dropdown";

const options: DropdownOption[] = [
	{ label: "Default", value: "" },
	{ label: "Popularity", value: "Popularity" },
	{ label: "Price Low to High", value: "Price Low to High" },
	{ label: "Price High to Low", value: "Price High to Low" },
];

describe("Dropdown Component", () => {
	it("renders the label associated with the select", () => {
		render(
			<Dropdown
				id="sort"
				label="Sort"
				options={options}
				selectedValue=""
				handleSelection={() => {}}
			/>
		);

		const select = screen.getByLabelText("Sort");
		expect(select.tagName).toBe("SELECT");
	});

	it("renders one option per provided value with its label", () => {
		render(
			<Dropdown
				id="sort"
				label="Sort"
				options={options}
				selectedValue=""
				handleSelection={() => {}}
			/>
		);

		const renderedOptions = screen.getAllByRole("option");
		expect(renderedOptions).toHaveLength(options.length);
		expect(renderedOptions[0]).toHaveTextContent("Default");
		expect(renderedOptions[0]).toHaveValue("");
	});

	it("displays the controlled selected value", () => {
		render(
			<Dropdown
				id="sort"
				label="Sort"
				options={options}
				selectedValue="Popularity"
				handleSelection={() => {}}
			/>
		);

		expect(screen.getByLabelText("Sort")).toHaveValue("Popularity");
	});

	it("calls handleSelection with the new value when the user selects an option", async () => {
		const handleSelection = vi.fn();

		render(
			<Dropdown
				id="sort"
				label="Sort"
				options={options}
				selectedValue=""
				handleSelection={handleSelection}
			/>
		);

		await userEvent.selectOptions(screen.getByLabelText("Sort"), "Popularity");

		expect(handleSelection).toHaveBeenCalledWith("Popularity");
	});
});
