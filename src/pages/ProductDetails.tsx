import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck } from "@fortawesome/free-solid-svg-icons";
import ProductPrice from "../components/products/ProductPrice";
import QuantityStepper from "../components/products/QuantityStepper";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { buttonClasses, inlineLinkClass } from "../components/common/buttonStyles";
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
		<Container className="py-8 sm:py-12">
			<Link to="/" className={`mb-8 ${buttonClasses({ variant: "text" })}`}>
				<FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
				All stickers
			</Link>
			<div className="grid gap-10 md:grid-cols-2 md:gap-12">
				<div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
					<img
						src={product.imageUrl}
						alt={product.name}
						className="aspect-[10/11] w-full object-cover"
					/>
				</div>
				<div className="md:sticky md:top-24 md:self-start">
					<h1 className="text-3xl font-semibold tracking-tight text-balance text-slate-900 sm:text-4xl dark:text-slate-100">
						{product.name}
					</h1>
					<p className="mt-4 text-2xl text-primary">
						<ProductPrice price={product.price} />
					</p>
					<p className="mt-6 max-w-[65ch] text-pretty text-slate-600 dark:text-slate-400">
						{product.description}
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
						<QuantityStepper
							value={quantity}
							onIncrement={increment}
							onDecrement={decrement}
						/>
						<Button size="lg" onClick={handleAddToCart} className="w-full sm:w-auto">
							Add to cart
						</Button>
					</div>
					{justAdded && (
						<p role="status" className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
							<FontAwesomeIcon icon={faCheck} className="text-primary" aria-hidden="true" />
							Added to cart.
							<Link to="/cart" className={inlineLinkClass}>
								View cart
							</Link>
						</p>
					)}
				</div>
			</div>
		</Container>
	);
};

export default ProductDetails;
