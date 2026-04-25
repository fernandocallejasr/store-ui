import apiClient from "../api/apiClient";
import type { Product } from "../components/products/types";
import mockProducts from "../data/products";

const useMockProducts = import.meta.env.VITE_USE_MOCK_PRODUCTS === "true";
const PRODUCTS_URL_PATH = "/products";

export const getProducts = async (): Promise<Product[]> => {
	if (useMockProducts){
		return mockProducts;
	}

	const { data } = await apiClient.get<Product[]>(PRODUCTS_URL_PATH);
	return data;
};