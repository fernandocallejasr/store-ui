import { useLoaderData } from "react-router-dom";
import ProductListings from "../products/ProductListings";
import HomeHero from "./HomeHero";
import type { homeLoader } from "./homeLoader";

const Home = () => {
	const products = useLoaderData<typeof homeLoader>();

	return (
		<>
			<HomeHero products={products} />
			<ProductListings products={products} />
		</>
	);
};

export default Home;
