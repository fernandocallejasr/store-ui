import SiteShell from "../layouts/SiteShell";
import ErrorPage from "./ErrorPage";

// The root route's errorElement replaces MainLayout entirely, so it brings the
// site chrome back itself; otherwise a 404 would have no way out.
const RootErrorPage = () => (
	<SiteShell>
		<ErrorPage />
	</SiteShell>
);

export default RootErrorPage;
