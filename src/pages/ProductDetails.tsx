import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import ProductPrice from "../components/products/ProductPrice";
import QuantityStepper from "../components/products/QuantityStepper";
import { useCart } from "../context/useCart";
import type { productDetailsLoader } from "./productDetailsLoader";

const ProductDetails = () => {
	const product = useLoaderData<typeof productDetailsLoader>();

	const { addToCart } = useCart();

	const [quantity, setQuantity] = useState<number>(1);
	const [justAdded, setJustAdded] = useState<boolean>(false);

	const decrement = () => {
		setQuantity((prev) => Math.max(1, prev - 1));
		setJustAdded(false);
	};

	const increment = () => {
		setQuantity((prev) => prev + 1);
		setJustAdded(false);
	};

	const handleAddToCart = () => {
		addToCart(product, quantity);
		setQuantity(1);
		setJustAdded(true);
	};

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
						<QuantityStepper
							value={quantity}
							onIncrement={increment}
							onDecrement={decrement}
						/>
						<button
							type="button"
							onClick={handleAddToCart}
							className="bg-primary text-on-primary font-semibold py-2 px-6 rounded-md hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							Add to cart
						</button>
					</div>
					{justAdded && (
						<p role="status" className="mt-3 text-sm text-green-700 dark:text-green-400">
							Added to cart ✓{" "}
							<Link
								to="/cart"
								className="font-medium underline hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
							>
								View cart
							</Link>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
