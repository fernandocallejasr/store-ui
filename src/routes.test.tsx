import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { AxiosError, type AxiosResponse } from "axios";
import { routes } from "./routes";
import { getProductById, getProducts } from "./repositories/productRepository";
import { getProfile } from "./repositories/profileRepository";
import { login } from "./repositories/authRepository";
import { AuthProvider } from "./context/AuthContext";
import { SESSION_STORAGE_KEY } from "./context/authContextValue";
import type { Product } from "./components/products/types";
import type { Session, User } from "./components/auth/types";

vi.mock("./repositories/productRepository", () => ({
	getProducts: vi.fn(),
	getProductById: vi.fn(),
}));

vi.mock("./repositories/profileRepository", () => ({
	getProfile: vi.fn(),
}));

vi.mock("./repositories/authRepository", () => ({
	login: vi.fn(),
	register: vi.fn(),
}));

const testProduct: Product = {
	productId: 1,
	price: 5,
	imageUrl: "/a.png",
	name: "Sticker A",
	description: "",
	popularity: "high",
};

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 1, name: "My User" } };

const testProfile: User = {
	userId: 1,
	name: "Renamed User",
	email: "myuser@example.com",
	mobileNumber: "5550000000",
};

const axiosErrorWithStatus = (status: number): AxiosError => {
	const error = new AxiosError("Request failed");
	error.response = { status } as AxiosResponse;
	return error;
};

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

const renderAt = (path: string) => {
	const router = createMemoryRouter(routes, { initialEntries: [path] });
	return render(
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>,
	);
};

describe("App routing", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.mocked(getProducts).mockReset().mockResolvedValue([]);
		vi.mocked(getProductById).mockReset().mockResolvedValue(testProduct);
		vi.mocked(getProfile).mockReset().mockResolvedValue(testProfile);
	});

	// Pins where hydrateFallbackElement lives. useNavigation() stays "idle" during
	// initial hydration, so MainLayout's pending UI cannot cover a cold load — the
	// fallback does. It sits on the index route rather than the root so that
	// MainLayout keeps rendering: on the root it would replace MainLayout itself
	// and the chrome would vanish, which this test would catch.
	it("shows the loading view with header and footer during a cold load", () => {
		vi.mocked(getProducts).mockReturnValue(new Promise(() => {}));

		renderAt("/");

		expect(screen.getByRole("status")).toBeInTheDocument();
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("renders the About page at /about", async () => {
		renderAt("/about");

		expect(
			await screen.findByText("About", { selector: "div" }),
		).toBeInTheDocument();
	});

	it("renders the Cart page at /cart for a signed-in visitor", async () => {
		signIn();

		renderAt("/cart");

		expect(
			await screen.findByRole("heading", { name: /your cart/i }),
		).toBeInTheDocument();
	});

	it("sends an anonymous visitor from /cart to the login page", async () => {
		renderAt("/cart");

		expect(
			await screen.findByRole("heading", { name: /welcome back/i }),
		).toBeInTheDocument();
		expect(screen.queryByRole("heading", { name: /your cart/i })).not.toBeInTheDocument();
	});

	it("renders /profile from the endpoint, not from the user stored at login", async () => {
		signIn();

		renderAt("/profile");

		expect(
			await screen.findByRole("heading", { name: /your profile/i }),
		).toBeInTheDocument();
		expect(screen.getByText(testProfile.name)).toBeInTheDocument();
		expect(getProfile).toHaveBeenCalledWith(expect.any(AbortSignal));
	});

	it("sends an anonymous visitor from /profile to the login page without calling the API", async () => {
		renderAt("/profile");

		expect(
			await screen.findByRole("heading", { name: /welcome back/i }),
		).toBeInTheDocument();
		expect(getProfile).not.toHaveBeenCalled();
	});

	it.each([401, 404])(
		"signs the visitor out and sends them to login when /profile answers %i",
		async (status) => {
			signIn();
			vi.mocked(getProfile).mockRejectedValue(axiosErrorWithStatus(status));

			renderAt("/profile");

			expect(
				await screen.findByRole("heading", { name: /welcome back/i }),
			).toBeInTheDocument();
			expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
			expect(screen.queryByRole("button", { name: /my user/i })).not.toBeInTheDocument();
			expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
		},
	);

	it("sends the visitor from /profile to login, hiding their details, when another tab logs out", async () => {
		signIn();
		renderAt("/profile");
		expect(await screen.findByText(testProfile.email)).toBeInTheDocument();

		// jsdom does not deliver storage events between windows, so this raises the
		// one that another tab's logout would.
		act(() => {
			localStorage.removeItem(SESSION_STORAGE_KEY);
			window.dispatchEvent(
				new StorageEvent("storage", { key: SESSION_STORAGE_KEY, newValue: null }),
			);
		});

		expect(
			await screen.findByRole("heading", { name: /welcome back/i }),
		).toBeInTheDocument();
		expect(screen.queryByText(testProfile.email)).not.toBeInTheDocument();
	});

	it("returns to /profile after logging out there and logging back in", async () => {
		signIn();
		vi.mocked(login).mockResolvedValue({
			message: "Correctly logged in",
			user: { ...testProfile, name: "My User" },
			jwtToken: "a.b.c",
		});
		renderAt("/profile");
		await screen.findByRole("heading", { name: /your profile/i });

		await userEvent.click(screen.getByRole("button", { name: /my user/i }));
		await userEvent.click(screen.getByRole("button", { name: "Log out" }));
		await screen.findByRole("heading", { name: /welcome back/i });
		await userEvent.type(screen.getByLabelText("Username"), "myuser@example.com");
		await userEvent.type(screen.getByLabelText("Password"), "secret");
		await userEvent.click(screen.getByRole("button", { name: "Log in" }));

		expect(
			await screen.findByRole("heading", { name: /your profile/i }),
		).toBeInTheDocument();
	});

	it("renders the ErrorPage, keeping the visitor signed in, when /profile fails otherwise", async () => {
		signIn();
		vi.mocked(getProfile).mockRejectedValue(axiosErrorWithStatus(500));

		renderAt("/profile");

		expect(
			await screen.findByRole("heading", { name: /something went wrong/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /my user/i })).toBeInTheDocument();
	});

	it("renders the Register page at /register", async () => {
		renderAt("/register");

		expect(
			await screen.findByRole("heading", { name: /create an account/i }),
		).toBeInTheDocument();
	});

	it("redirects /home to the index route", async () => {
		renderAt("/home");

		expect(await screen.findByText("My Page Heading")).toBeInTheDocument();
	});

	it("renders the ProductDetails page at /products/:id", async () => {
		renderAt("/products/1");

		expect(
			await screen.findByRole("heading", { name: testProduct.name }),
		).toBeInTheDocument();
		expect(getProductById).toHaveBeenCalledWith(1, expect.any(AbortSignal));
	});

	it("renders the ErrorPage for a non-numeric product id", async () => {
		renderAt("/products/abc");

		expect(
			await screen.findByRole("heading", { name: /page not found/i }),
		).toBeInTheDocument();
		expect(getProductById).not.toHaveBeenCalled();

		// errorElement sits on the child route, not the root: on the root it would
		// replace MainLayout and take the chrome down with it.
		expect(screen.getByRole("banner")).toBeInTheDocument();
		expect(screen.getByRole("contentinfo")).toBeInTheDocument();
	});

	it("renders the ErrorPage for unknown routes", async () => {
		renderAt("/totally-not-a-route");

		expect(
			await screen.findByRole("heading", { name: /page not found/i }),
		).toBeInTheDocument();
	});
});
