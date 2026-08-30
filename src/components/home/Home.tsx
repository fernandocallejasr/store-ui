import PageHeading from "../PageHeading";
import ProductListings from "../products/ProductListings";
import LoadingView from "../status/LoadingView";
import ErrorView from "../status/ErrorView";
import { useState, useEffect } from "react";
import { getProducts } from "../../repositories/productRepository";
import type { Product } from "../products/types";

const Home = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>(undefined);

	const fetchProducts = async () => {
		try {
			// TODO: cancellation on unmount.
			setLoading(true);
			setError(undefined);
			const productsResponse = await getProducts();
			setProducts(productsResponse);
		} catch {
			setError("An error occurred fetching products. Please try again");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount; will be removed by future loader refactor
		fetchProducts();
	}, []);

	if (loading) return(
		<LoadingView message="Loading products…" />
	);

	if (error) return (
		<ErrorView
			title="Something went wrong"
			message={error}
			onRetry={fetchProducts}
			retryLabel="Try again"
		/>
	);

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