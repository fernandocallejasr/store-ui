import apiClient from "../api/apiClient";
import { getProductById, getProducts } from "./productRepository";
import { clearProductCache } from "./productCache";

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
		clearProductCache();
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

describe("productRepository caching", () => {
	beforeEach(() => {
		mockedApiClientGet.mockReset();
		clearProductCache();
	});

	it("getProducts warms the cache so getProductById skips the network", async () => {
		mockedApiClientGet.mockResolvedValue({ data: [product] });

		await getProducts();
		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);

		const result = await getProductById(1);

		expect(result.productId).toBe(1);
		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);
	});

	it("getProductById fetches on a cache miss and caches the result", async () => {
		mockedApiClientGet.mockResolvedValue({ data: product });

		const first = await getProductById(1);

		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);
		expect(first.productId).toBe(1);

		const second = await getProductById(1);

		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);
		expect(second).toEqual(first);
	});

	it("getProducts caches every product it returns, not just the first", async () => {
		const secondProduct = { ...product, productId: 2, name: "Sticker B" };
		mockedApiClientGet.mockResolvedValue({ data: [product, secondProduct] });

		await getProducts();
		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);

		const fromCache = await getProductById(2);

		expect(fromCache.productId).toBe(2);
		expect(mockedApiClientGet).toHaveBeenCalledTimes(1);
	});

	it("still fetches an id the warmed cache does not contain", async () => {
		mockedApiClientGet.mockResolvedValueOnce({ data: [product] });
		await getProducts();

		mockedApiClientGet.mockResolvedValueOnce({ data: { ...product, productId: 99 } });
		const result = await getProductById(99);

		expect(result.productId).toBe(99);
		expect(mockedApiClientGet).toHaveBeenCalledTimes(2);
		expect(mockedApiClientGet.mock.lastCall?.[0]).toBe("/products/99");
	});

	it("does not cache a failed fetch, so a later call retries", async () => {
		mockedApiClientGet.mockRejectedValueOnce(new Error("network down"));

		await expect(getProductById(1)).rejects.toThrow("network down");

		mockedApiClientGet.mockResolvedValueOnce({ data: product });
		const retried = await getProductById(1);

		expect(retried.productId).toBe(1);
		expect(mockedApiClientGet).toHaveBeenCalledTimes(2);
	});
});
