import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

	it("provides a link back to the shop", async () => {
		renderWithLoaderThrow(new Error("kaboom"));

		expect(
			await screen.findByRole("link", { name: "Back to shop" }),
		).toHaveAttribute("href", "/");
	});

	it("shows the 404 code for a missing page", async () => {
		renderWithLoaderThrow(new Response("Not Found", { status: 404 }));

		await screen.findByRole("heading", { name: "Page not found" });

		expect(screen.getByText("404")).toBeInTheDocument();
	});

	it("does not show a 404 code for other errors", async () => {
		renderWithLoaderThrow(new Error("kaboom"));

		await screen.findByRole("heading", { name: "Something went wrong" });

		expect(screen.queryByText("404")).not.toBeInTheDocument();
	});

	it("re-runs the route loader when the retry button is clicked", async () => {
		const loader = vi
			.fn()
			.mockImplementationOnce(() => {
				throw new Error("network down");
			})
			.mockImplementationOnce(() => "recovered");

		const router = createMemoryRouter(
			[
				{
					path: "/",
					loader,
					element: <div>Recovered content</div>,
					errorElement: <ErrorPage />,
				},
			],
			{ initialEntries: ["/"] },
		);
		render(<RouterProvider router={router} />);

		await userEvent.click(await screen.findByRole("button", { name: /try again/i }));

		expect(await screen.findByText("Recovered content")).toBeInTheDocument();
		expect(loader).toHaveBeenCalledTimes(2);
	});

	it("does not offer retry for a 404 route response", async () => {
		renderWithLoaderThrow(new Response("Not Found", { status: 404 }));

		await screen.findByRole("heading", { name: "Page not found" });

		expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument();
	});
});
