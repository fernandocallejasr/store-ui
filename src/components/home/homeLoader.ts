import type { LoaderFunctionArgs } from "react-router-dom";
import { getProducts } from "../../repositories/productRepository";
import type { Product } from "../products/types";

export const homeLoader = ({ request }: LoaderFunctionArgs): Promise<Product[]> =>
	getProducts(request.signal);
