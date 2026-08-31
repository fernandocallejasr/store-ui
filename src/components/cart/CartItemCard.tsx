import { Link } from "react-router-dom";
import type { CartItem } from "../../context/cartContextValue";
import { useCart } from "../../context/useCart";
import ProductPrice from "../products/ProductPrice";
import QuantityStepper from "../products/QuantityStepper";

interface CartItemCardProps {
	item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
	const { updateQuantity, removeFromCart } = useCart();
	const { product, quantity } = item;
	const subtotal = product.price * quantity;

	return (
		<div className="flex flex-col rounded-md border border-gray-300 dark:border-gray-700 shadow-md overflow-hidden bg-white dark:bg-gray-800 font-primary">
			<Link
				to={`/products/${product.productId}`}
				aria-label={`View details for ${product.name}`}
				className="relative block w-full h-32 border-b border-gray-300 dark:border-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
			>
				<img
					src={product.imageUrl}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
				/>
			</Link>
			<div className="p-3 flex flex-col gap-2">
				<h3 className="text-base font-semibold text-primary truncate">
					{product.name}
				</h3>
				<div className="flex items-end justify-between text-sm text-gray-600 dark:text-gray-400">
					<span data-testid="line-breakdown">
						{quantity} × <ProductPrice currency="$" price={product.price} />
					</span>
					<span className="text-right leading-tight">
						<span className="block text-xs text-gray-500 dark:text-gray-400">Subtotal</span>
						<span data-testid="line-subtotal" className="font-medium text-primary">
							<ProductPrice currency="$" price={subtotal} />
						</span>
					</span>
				</div>
				<div className="flex items-center justify-between gap-2 mt-1">
					<QuantityStepper
						value={quantity}
						onIncrement={() => updateQuantity(product.productId, quantity + 1)}
						onDecrement={() => updateQuantity(product.productId, quantity - 1)}
						label={product.name}
					/>
					<button
						type="button"
						onClick={() => removeFromCart(product.productId)}
						aria-label={`Remove ${product.name} from cart`}
						className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
					>
						Remove
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartItemCard;
