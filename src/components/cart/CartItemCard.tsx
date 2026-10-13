import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import type { CartItem } from "../../context/cartContextValue";
import { useCart } from "../../context/useCart";
import ProductPrice from "../products/ProductPrice";
import QuantityStepper from "../products/QuantityStepper";
import { focusRing } from "../common/buttonStyles";

interface CartItemCardProps {
	item: CartItem;
}

// A row of the cart's item list; render it inside a <ul>.
const CartItemCard = ({ item }: CartItemCardProps) => {
	const { updateQuantity, removeFromCart } = useCart();
	const { product, quantity } = item;
	const subtotal = product.price * quantity;

	return (
		<li className="flex gap-4 py-6 first:pt-0 sm:gap-6">
			<Link
				to={`/products/${product.productId}`}
				aria-label={`View details for ${product.name}`}
				className={`block w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10 ${focusRing}`}
			>
				<img
					src={product.imageUrl}
					alt={product.name}
					className="aspect-[10/11] w-full object-cover"
				/>
			</Link>
			<div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0">
					<h2 className="truncate font-medium text-slate-900 dark:text-slate-100">
						{product.name}
					</h2>
					<p data-testid="line-breakdown" className="mt-1 text-sm text-slate-600 dark:text-slate-400">
						<ProductPrice price={product.price} /> each
					</p>
					<button
						type="button"
						onClick={() => removeFromCart(product.productId)}
						aria-label={`Remove ${product.name} from cart`}
						className={`mt-3 inline-flex items-center gap-2 rounded-sm text-sm text-slate-600 transition-colors hover:text-slate-900 hover:underline dark:text-slate-400 dark:hover:text-slate-100 ${focusRing}`}
					>
						<FontAwesomeIcon icon={faTrashCan} aria-hidden="true" />
						Remove
					</button>
				</div>
				<div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
					<QuantityStepper
						value={quantity}
						onIncrement={() => updateQuantity(product.productId, quantity + 1)}
						onDecrement={() => updateQuantity(product.productId, quantity - 1)}
						label={product.name}
					/>
					<p className="text-right">
						<span className="block text-xs text-slate-600 dark:text-slate-400">Subtotal</span>
						<span data-testid="line-subtotal" className="font-medium text-slate-900 dark:text-slate-100">
							<ProductPrice price={subtotal} />
						</span>
					</p>
				</div>
			</div>
		</li>
	);
};

export default CartItemCard;
