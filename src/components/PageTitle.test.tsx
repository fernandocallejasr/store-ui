import { render, screen } from "@testing-library/react";
import PageTitle from "./PageTitle";

describe('PageTitle Component', () => {
	it('should render the title text', () => {
		render(<PageTitle title="Test Title" />);

		expect(screen.getByText("Test Title")).toBeInTheDocument();
	});
});
