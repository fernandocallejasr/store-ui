import apiClient from "../api/apiClient";
import type { Product } from "../components/products/types";
import mockProducts from "../data/products";
import { cacheProduct, cacheProducts, getCachedProduct } from "./productCache";

const useMockProducts = import.meta.env.VITE_USE_MOCK_PRODUCTS === "true";
const PRODUCTS_URL_PATH = "/products";

export const getProducts = async (signal?: AbortSignal): Promise<Product[]> => {
	if (useMockProducts){
		cacheProducts(mockProducts);
		return mockProducts;
	}

	const { data } = await apiClient.get<Product[]>(PRODUCTS_URL_PATH, { signal });
	cacheProducts(data);
	return data;
};

export const getProductById = async (id: number, signal?: AbortSignal): Promise<Product> => {
	const cached = getCachedProduct(id);
	if (cached)
		return cached;

	if (useMockProducts) {
		const product = mockProducts.find((p) => p.productId === id);
		if (!product)
			throw new Error("Product not found");

		cacheProduct(product);
		return product;
	}

	const { data } = await apiClient.get<Product>(`${PRODUCTS_URL_PATH}/${id}`, { signal });
	cacheProduct(data);
	return data;
};