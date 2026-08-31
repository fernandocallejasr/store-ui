import { Link } from "react-router-dom";
import type { Product } from "./types";
import ProductPrice from "./ProductPrice";
import { useCart } from "../../context/useCart";

interface ProductCardProps {
	product: Product;
};

const ProductCard = ({
	product
}: ProductCardProps) => {
	const { addToCart } = useCart();

	return (
		<div className="w-72 mx-auto rounded-md border border-gray-300 dark:border-gray-700 shadow-md overflow-hidden flex flex-col bg-white dark:bg-gray-800 hover:shadow-lg transition">
			<Link
				to={`/products/${product.productId}`}
				aria-label={`View details for ${product.name}`}
				className="block rounded-t-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
			>
				<div className="relative w-full h-72 border-b border-gray-300 dark:border-gray-700">
					<img
						src={product.imageUrl}
						alt={product.name}
						className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
					/>
				</div>
				<div className="p-4 flex flex-col font-primary">
					<h2 className="text-xl font-semibold text-primary mb-2">{product.name}</h2>
					<p className="text-base text-gray-600 dark:text-gray-400">{product.description}</p>
				</div>
			</Link>
			<div className="px-4 pb-4 mt-auto flex items-center justify-between gap-4 font-primary">
				<div className="bg-lighter dark:bg-gray-700 text-purple-700 dark:text-light font-medium text-sm py-2 px-4 rounded-md">
					<ProductPrice currency="$" price={product.price} />
				</div>
				<button
					type="button"
					onClick={() => addToCart(product)}
					aria-label={`Add ${product.name} to cart`}
					className="bg-primary text-white font-semibold text-sm py-2 px-4 rounded-md hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					Add to cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
