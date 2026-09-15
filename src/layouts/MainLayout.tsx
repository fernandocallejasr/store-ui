import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import LoadingView from "../components/status/LoadingView";

const MainLayout = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 flex flex-col">
				<Suspense fallback={<LoadingView message="Loading…" />}>
					{isLoading ? <LoadingView message="Loading…" /> : <Outlet />}
				</Suspense>
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
