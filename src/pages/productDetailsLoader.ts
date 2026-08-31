import axios from "axios";
import type { LoaderFunctionArgs } from "react-router-dom";
import { getProductById } from "../repositories/productRepository";
import type { Product } from "../components/products/types";

// A missing product is a 404 the user should see as "not found". Anything else
// (network down, 500) must stay an error so ErrorPage shows the generic message
// and offers a retry, rather than claiming the product doesn't exist.
const isNotFound = (error: unknown): boolean =>
	(axios.isAxiosError(error) && error.response?.status === 404) ||
	(error instanceof Error && error.message === "Product not found");

export type ProductDetailsLoaderArgs = Pick<LoaderFunctionArgs, "params" | "request">;

export const productDetailsLoader = async ({
	params,
	request,
}: ProductDetailsLoaderArgs): Promise<Product> => {
	const numericId = Number(params.id);

	if (!Number.isInteger(numericId) || numericId <= 0)
		throw new Response("Not Found", { status: 404 });

	try {
		return await getProductById(numericId, request.signal);
	} catch (error) {
		if (isNotFound(error))
			throw new Response("Not Found", { status: 404 });

		throw error;
	}
};
