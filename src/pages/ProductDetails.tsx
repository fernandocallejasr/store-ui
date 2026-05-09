import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductPrice from "../components/products/ProductPrice";
import LoadingView from "../components/status/LoadingView";
import ErrorView from "../components/status/ErrorView";
import { getProductById } from "../repositories/productRepository";
import type { Product } from "../components/products/types";

interface ProductLocationState {
	product?: Product;
};

const ProductDetails = () => {
	const { id } = useParams<{ id: string }>();
	const { state } = useLocation() as { state: ProductLocationState | null };
	const passedProduct = state?.product;

	const [product, setProduct] = useState<Product | undefined>(passedProduct);
	const [loading, setLoading] = useState<boolean>(!passedProduct);
	const [error, setError] = useState<string | undefined>(undefined);

	const fetchProduct = async () => {
		const numericId = Number(id);
		if (!Number.isInteger(numericId) || numericId <= 0) {
			setError("Invalid product id");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(undefined);
			const result = await getProductById(numericId);
			setProduct(result);
		} catch {
			setError("Could not load this product. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (passedProduct)
			return;

		fetchProduct();
	}, [id]);

	if (loading) {
		return <LoadingView message="Loading product…" />;
	}

	if (error || !product) return (
		<ErrorView
			title="Something went wrong"
			message={error ?? "Product not found."}
			onRetry={fetchProduct}
			retryLabel="Try again"
		/>
	);

	return (
		<div className="max-w-5xl mx-auto px-6 py-8 font-primary">
			<Link
				to="/"
				className="inline-flex items-center text-sm text-primary hover:underline mb-6"
			>
				← Back to products
			</Link>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md overflow-hidden">
				<div className="relative w-full h-96 md:h-full bg-gray-100 dark:bg-gray-900">
					<img
						src={product.imageUrl}
						alt={product.name}
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="p-8 flex flex-col">
					<h1 className="text-3xl font-semibold text-primary mb-4">
						{product.name}
					</h1>
					<p className="text-base text-gray-600 dark:text-gray-400 mb-6">
						{product.description}
					</p>
					<div className="flex items-center gap-4 mb-6">
						<span className="bg-lighter dark:bg-gray-700 text-purple-700 dark:text-light font-medium text-lg py-2 px-4 rounded-md">
							<ProductPrice currency="$" price={product.price} />
						</span>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							Popularity: <span className="font-medium">{product.popularity}</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
