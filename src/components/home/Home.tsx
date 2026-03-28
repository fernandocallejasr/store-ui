import products from "../../data/products";
import PageHeading from "../PageHeading";
import ProductListings from "../products/ProductListings";

const Home = () => {
	return (
		<div className="home-container">
			<PageHeading title="My Page Heading">
				<p className="page-heading-paragraph">
					Add a touch of creativity to your space with our wide range of fun and
        			unique stickers. Perfect for any occasion!
				</p>
			</PageHeading>
			<ProductListings products={products}/>
		</div>
	);
};

export default Home;