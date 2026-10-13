import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import CartItemCard from "../components/cart/CartItemCard";
import ProductPrice from "../components/products/ProductPrice";
import PageHeading from "../components/PageHeading";
import Container from "../components/common/Container";
import { buttonClasses } from "../components/common/buttonStyles";

const Cart = () => {
	const { cart, totalQuantity } = useCart();

	const total = useMemo(
		() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
		[cart],
	);

	if (cart.length === 0) {
		return (
			<Container className="pb-16">
				<PageHeading title="Your cart" />
				<div className="flex flex-col items-center gap-6 py-12 text-center">
					<img src="/stickers/emptycart.png" alt="" className="w-48 rounded-xl sm:w-56" />
					<p className="text-xl font-medium text-slate-900 dark:text-slate-100">
						Your cart is empty.
					</p>
					<Link to="/" className={buttonClasses({ size: "lg" })}>
						Browse stickers
					</Link>
				</div>
			</Container>
		);
	}

	return (
		<Container className="pb-16">
			<PageHeading
				title="Your cart"
				meta={`${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`}
			/>
			<div className="grid gap-10 lg:grid-cols-3">
				<ul className="divide-y divide-slate-200 lg:col-span-2 dark:divide-slate-800">
					{cart.map((item) => (
						<CartItemCard key={item.product.productId} item={item} />
					))}
				</ul>

				<aside
					aria-labelledby="cart-summary-title"
					className="h-fit rounded-xl bg-white p-6 lg:sticky lg:top-24 dark:bg-slate-900"
				>
					<h2 id="cart-summary-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
						Summary
					</h2>
					<dl className="mt-4 space-y-3 text-sm">
						<div className="flex justify-between">
							<dt className="text-slate-600 dark:text-slate-400">Items</dt>
							<dd className="font-mono tabular-nums text-slate-900 dark:text-slate-100">{totalQuantity}</dd>
						</div>
						<div className="flex items-baseline justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
							<dt className="font-medium text-slate-900 dark:text-slate-100">Total</dt>
							<dd data-testid="cart-total-price" className="text-2xl text-primary">
								<ProductPrice price={total} />
							</dd>
						</div>
					</dl>
					<Link to="/" className={`mt-6 ${buttonClasses({ variant: "text" })}`}>
						Continue shopping
					</Link>
				</aside>
			</div>
		</Container>
	);
};

export default Cart;
