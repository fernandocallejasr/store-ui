import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductPrice from "../components/products/ProductPrice";
import LoadingView from "../components/status/LoadingView";
import ErrorView from "../components/status/ErrorView";
import { getProductById } from "../repositories/productRepository";
import { useCart } from "../context/useCart";
import type { Product } from "../components/products/types";

interface ProductLocationState {
	product?: Product;
};

const ProductDetails = () => {
	const { id } = useParams<{ id: string }>();
	const { state } = useLocation() as { state: ProductLocationState | null };
	const passedProduct = state?.product;

	const { addToCart } = useCart();

	const [product, setProduct] = useState<Product | undefined>(passedProduct);
	const [loading, setLoading] = useState<boolean>(!passedProduct);
	const [error, setError] = useState<string | undefined>(undefined);
	const [quantity, setQuantity] = useState<number>(1);

	const decrement = () => setQuantity((prev) => Math.max(1, prev - 1));
	const increment = () => setQuantity((prev) => prev + 1);

	const handleAddToCart = () => {
		if (!product)
			return;

		addToCart(product, quantity);
		setQuantity(1);
	};

	const fetchProduct = useCallback(async () => {
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
	}, [id]);

	useEffect(() => {
		if (passedProduct)
			return;

		// eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; will be removed by future loader refactor
		fetchProduct();
	}, [passedProduct, fetchProduct]);

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
					<div className="flex items-center gap-4 mt-auto">
						<div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
							<button
								type="button"
								onClick={decrement}
								disabled={quantity <= 1}
								aria-label="Decrease quantity"
								className="px-3 py-2 text-lg text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lighter dark:hover:bg-gray-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
							>
								−
							</button>
							<span
								data-testid="quantity"
								aria-live="polite"
								className="px-4 py-2 min-w-12 text-center font-medium text-primary"
							>
								{quantity}
							</span>
							<button
								type="button"
								onClick={increment}
								aria-label="Increase quantity"
								className="px-3 py-2 text-lg text-primary hover:bg-lighter dark:hover:bg-gray-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
							>
								+
							</button>
						</div>
						<button
							type="button"
							onClick={handleAddToCart}
							className="bg-primary text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							Add to cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
