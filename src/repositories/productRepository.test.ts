import apiClient from "../api/apiClient";
import { getProductById, getProducts } from "./productRepository";

vi.mock("../api/apiClient", () => ({
	default: { get: vi.fn() },
}));

const mockedApiClientGet = vi.mocked(apiClient.get);

const product = {
	productId: 1,
	price: 5,
	imageUrl: "/a.png",
	name: "Sticker A",
	description: "",
	popularity: "high",
};

describe("productRepository signal threading", () => {
	beforeEach(() => {
		mockedApiClientGet.mockReset();
	});

	it("passes the signal to axios on getProducts", async () => {
		mockedApiClientGet.mockResolvedValue({ data: [product] });
		const controller = new AbortController();

		await getProducts(controller.signal);

		expect(mockedApiClientGet).toHaveBeenCalledWith("/products", { signal: controller.signal });
	});

	it("passes the signal to axios on getProductById", async () => {
		mockedApiClientGet.mockResolvedValue({ data: product });
		const controller = new AbortController();

		await getProductById(1, controller.signal);

		expect(mockedApiClientGet).toHaveBeenCalledWith("/products/1", { signal: controller.signal });
	});
});
