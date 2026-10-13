import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import CartItemCard from "../components/cart/CartItemCard";
import ProductPrice from "../components/products/ProductPrice";

const Cart = () => {
	const { cart } = useCart();

	const total = useMemo(
		() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
		[cart],
	);

	const backToHome = (
		<Link
			to="/"
			className="inline-flex items-center text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
		>
			Back to home
		</Link>
	);

	return (
		<div className="max-w-6xl mx-auto px-6 py-8 font-primary">
			<h1 className="text-3xl font-semibold text-primary mb-6">Your Cart</h1>

			{cart.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-center gap-8 min-h-[50vh] py-16">
					<p className="text-3xl font-medium text-gray-600 dark:text-gray-400">
						Your cart is empty.
					</p>
					<Link
						to="/"
						className="bg-primary text-on-primary text-lg font-semibold py-3 px-8 rounded-md hover:opacity-90 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						Back to home
					</Link>
				</div>
			) : (
				<>
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
						{cart.map((item) => (
							<CartItemCard key={item.product.productId} item={item} />
						))}
					</div>

					<div className="flex items-center justify-between border-t border-gray-300 dark:border-gray-700 mt-6 pt-4">
						{backToHome}
						<p className="text-lg font-semibold text-primary">
							Total:{" "}
							<span data-testid="cart-total-price">
								<ProductPrice currency="$" price={total} />
							</span>
						</p>
					</div>
				</>
			)}
		</div>
	);
};

export default Cart;
