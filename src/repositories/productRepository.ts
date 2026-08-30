import apiClient from "../api/apiClient";
import type { Product } from "../components/products/types";
import mockProducts from "../data/products";

const useMockProducts = import.meta.env.VITE_USE_MOCK_PRODUCTS === "true";
const PRODUCTS_URL_PATH = "/products";

export const getProducts = async (signal?: AbortSignal): Promise<Product[]> => {
	if (useMockProducts){
		return mockProducts;
	}

	const { data } = await apiClient.get<Product[]>(PRODUCTS_URL_PATH, { signal });
	return data;
};

export const getProductById = async (id: number, signal?: AbortSignal): Promise<Product> => {
	if (useMockProducts) {
		const product = mockProducts.find((p) => p.productId === id);
		if (!product)
			throw new Error("Product not found");

		return product;
	}

	const { data } = await apiClient.get<Product>(`${PRODUCTS_URL_PATH}/${id}`, { signal });
	return data;
};