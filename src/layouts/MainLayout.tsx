import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingView from "../components/status/LoadingView";
import SiteShell from "./SiteShell";

const MainLayout = () => {
	const navigation = useNavigation();
	const isLoading = navigation.state === "loading";

	return (
		<SiteShell>
			<Suspense fallback={<LoadingView message="Loading…" />}>
				{isLoading ? <LoadingView message="Loading…" /> : <Outlet />}
			</Suspense>
		</SiteShell>
	);
};

export default MainLayout;
