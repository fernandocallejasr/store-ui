import "./ProductCard.styles.css"
import type { Product } from "./types";
import ProductPrice from "./ProductPrice";

interface ProductCardProps {
	product: Product;
};

const ProductCard = ({
	product
}: ProductCardProps) => {
	return (
		<div className="product-card">
			<div className="product-card-image-container">
				<img src={product.imageUrl} alt={product.name} className="product-card-image"/>
			</div>
			<div className="product-card-details">
				<h2 className="product-card-title">{product.name}</h2>
				<p className="product-card-description">{product.description}</p>
				<div className="product-card-footer">
					<div className="product-card-price">
						<ProductPrice currency="$" price={product.price} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;