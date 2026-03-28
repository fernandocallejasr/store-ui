import type { Product } from "./types";
import ProductCard from "./ProductCard";
import "./ProductListings.styles.css";

interface ProductListingsProps {
	products: Array<Product>;
};

const ProductListings = ({ 
		products 
}: ProductListingsProps ) => {
	return (
		<div className="product-listings-container">
			<div className="product-listings-grid">
				{ products.length > 0 ?
					products.map((product) => (
						<ProductCard key={product.productId} product={product}/>
					)) :
					<p className="product-listings-empty">No products found</p>
				}
			</div>
		</div>	
	);
};

export default ProductListings;