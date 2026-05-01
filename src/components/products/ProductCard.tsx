import type { Product } from "./types";
import ProductPrice from "./ProductPrice";

interface ProductCardProps {
	product: Product;
};

const ProductCard = ({
	product
}: ProductCardProps) => {
	return (
		<div className="w-72 rounded-md mx-auto border border-gray-300 dark:border-gray-700 shadow-md overflow-hidden flex flex-col bg-white dark:bg-gray-800 hover:shadow-lg transition">
			<div className="relative w-full h-72 border-b border-gray-300 dark:border-gray-700">
				<img 
					src={product.imageUrl}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
				/>
			</div>
			<div className="relative h-48 p-4 flex flex-col font-primary">
				<h2 className="text-xl font-semibold text-primary mb-2">{product.name}</h2>
				<p className="text-base text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
				<div className="flex items-center justify-between mt-auto">
					<div className="bg-lighter dark:bg-gray-700 text-purple-700 dark:text-light font-medium text-sm py-2 px-4 rounded-tl-md">
						<ProductPrice currency="$" price={product.price} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;