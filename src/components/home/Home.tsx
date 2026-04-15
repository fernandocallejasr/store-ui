import products from "../../data/products";
import PageHeading from "../PageHeading";
import ProductListings from "../products/ProductListings";

const Home = () => {
	return (
		<div className="max-w-6xl mx-auto px-6 py-8">
			<PageHeading title="My Page Heading">
				<p className="font-primary leading-6 text-gray-600">
					Add a touch of creativity to your space with our wide range of fun and
        			unique stickers. Perfect for any occasion!
				</p>
			</PageHeading>
			<ProductListings products={products}/>
		</div>
	);
};

export default Home;