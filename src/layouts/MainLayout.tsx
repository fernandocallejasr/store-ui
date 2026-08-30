import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import LoadingView from "../components/status/LoadingView";

const MainLayout = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<>
			<Header />
			<Suspense fallback={<LoadingView message="Loading…" />}>
				{isLoading ? <LoadingView message="Loading…" /> : <Outlet />}
			</Suspense>
			<Footer />
		</>
	);
};

export default MainLayout;
