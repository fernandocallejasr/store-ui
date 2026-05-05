import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import ErrorPage from "./ErrorPage";

const renderWithLoaderThrow = (thrown: unknown) => {
	const router = createMemoryRouter(
		[
			{
				path: "/",
				loader: () => {
					throw thrown;
				},
				element: <div />,
				errorElement: <ErrorPage />,
			},
		],
		{ initialEntries: ["/"] },
	);
	
	return render(<RouterProvider router={router} />);
};

describe("ErrorPage", () => {
	beforeEach(() => {
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	it("renders 'Page not found' for a 404 route response", async () => {
		renderWithLoaderThrow(new Response("Not Found", { status: 404 }));

		expect(
			await screen.findByRole("heading", { name: "Page not found" }),
		).toBeInTheDocument();
	});

	it("renders the generic message for thrown errors", async () => {
		renderWithLoaderThrow(new Error("kaboom"));

		expect(
			await screen.findByRole("heading", { name: "Something went wrong" }),
		).toBeInTheDocument();
		expect(screen.queryByText(/kaboom/)).not.toBeInTheDocument();
	});

	it("provides a link back to home", async () => {
		renderWithLoaderThrow(new Error("kaboom"));

		expect(
			await screen.findByRole("link", { name: /go back home/i }),
		).toHaveAttribute("href", "/");
	});
});
