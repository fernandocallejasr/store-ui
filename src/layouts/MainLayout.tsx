import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import LoadingView from "../components/status/LoadingView";

const MainLayout = () => {
	return (
		<>
			<Header />
			<Suspense fallback={<LoadingView message="Loading…" />}>
				<Outlet />
			</Suspense>
			<Footer />
		</>
	);
};

export default MainLayout;
