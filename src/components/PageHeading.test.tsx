import { render, screen } from "@testing-library/react";
import PageHeading from "./PageHeading";

describe('PageHeading Component', () => {
	it('should render the title', () => {
		render(<PageHeading title="Hello World" />);

		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});

	it('should render children content', () => {
		render(
			<PageHeading title="Hello World">
				<p>Child paragraph</p>
			</PageHeading>
		);

		expect(screen.getByText("Child paragraph")).toBeInTheDocument();
	});

	it('should render both title and children together', () => {
		render(
			<PageHeading title="My Title">
				<span>Extra content</span>
			</PageHeading>
		);

		expect(screen.getByText("My Title")).toBeInTheDocument();
		expect(screen.getByText("Extra content")).toBeInTheDocument();
	});
});
