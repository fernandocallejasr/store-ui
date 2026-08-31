import { productDetailsLoader } from "./productDetailsLoader";
import { getProductById } from "../repositories/productRepository";
import type { Product } from "../components/products/types";

vi.mock("../repositories/productRepository", () => ({
	getProductById: vi.fn(),
}));

const product: Product = {
	productId: 13,
	price: 89,
	imageUrl: "./mockUrl.png",
	name: "Fake Product",
	description: "This is not a real product",
	popularity: "Popularity",
};

const callLoader = (id: string) =>
	productDetailsLoader({
		params: { id },
		request: new Request(`http://localhost/products/${id}`),
	});

// Response.status is a prototype getter, so toMatchObject can't see it —
// catch the throw and assert on the instance directly.
const catchThrown = async (id: string): Promise<unknown> => {
	try {
		await callLoader(id);
	} catch (error) {
		return error;
	}
	throw new Error(`loader resolved for id "${id}" but should have thrown`);
};

describe("productDetailsLoader", () => {
	beforeEach(() => {
		vi.mocked(getProductById).mockReset();
	});

	it("returns the product for a valid id", async () => {
		vi.mocked(getProductById).mockResolvedValue(product);

		await expect(callLoader("13")).resolves.toEqual(product);
		expect(getProductById).toHaveBeenCalledWith(13, expect.any(AbortSignal));
	});

	it.each([
		["a non-numeric id", "abc"],
		["a negative id", "-1"],
		["zero", "0"],
		["a fractional id", "1.5"],
	])("throws a 404 Response for %s without hitting the repository", async (_label, id) => {
		const thrown = await catchThrown(id);

		expect(thrown).toBeInstanceOf(Response);
		expect((thrown as Response).status).toBe(404);
		expect(getProductById).not.toHaveBeenCalled();
	});

	it("throws a 404 Response when the repository says the product is missing", async () => {
		vi.mocked(getProductById).mockRejectedValue(new Error("Product not found"));

		const thrown = await catchThrown("99");

		expect(thrown).toBeInstanceOf(Response);
		expect((thrown as Response).status).toBe(404);
	});

	it("rethrows a network failure unchanged instead of calling it a 404", async () => {
		const failure = new Error("network down");
		vi.mocked(getProductById).mockRejectedValue(failure);

		const thrown = await catchThrown("13");

		expect(thrown).toBe(failure);
		expect(thrown).not.toBeInstanceOf(Response);
	});
});
