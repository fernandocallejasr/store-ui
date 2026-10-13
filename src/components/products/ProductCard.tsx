import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Product } from "./types";
import ProductPrice from "./ProductPrice";
import Button from "../common/Button";
import { focusRing } from "../common/buttonStyles";
import { useCart } from "../../context/useCart";

interface ProductCardProps {
	product: Product;
};

const ProductCard = ({
	product
}: ProductCardProps) => {
	const { addToCart } = useCart();

	return (
		<article className="group flex h-full flex-col">
			<Link
				to={`/products/${product.productId}`}
				aria-label={`View details for ${product.name}`}
				className={`block rounded-xl ${focusRing}`}
			>
				<div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:ring-white/10">
					<img
						src={product.imageUrl}
						alt={product.name}
						loading="lazy"
						decoding="async"
						className="aspect-[10/11] w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03]"
					/>
				</div>
				<h3 className="mt-3 truncate font-medium text-slate-900 dark:text-slate-100">
					{product.name}
				</h3>
				<p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
					{product.description}
				</p>
			</Link>
			<div className="mt-auto flex items-center justify-between gap-2 pt-3">
				<span className="text-sm font-medium text-primary">
					<ProductPrice price={product.price} />
				</span>
				<Button
					variant="secondary"
					onClick={() => addToCart(product)}
					aria-label={`Add ${product.name} to cart`}
				>
					<FontAwesomeIcon icon={faPlus} aria-hidden="true" />
					Add
				</Button>
			</div>
		</article>
	);
};

export default ProductCard;
