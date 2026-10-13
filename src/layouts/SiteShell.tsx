import type { PropsWithChildren } from "react";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import SkipLink from "../components/common/SkipLink";

// The page chrome shared by MainLayout and the root error page, so even a 404
// keeps the header, the footer and the skip link.
const SiteShell = ({ children }: PropsWithChildren) => (
	<div className="flex min-h-[100dvh] flex-col">
		<SkipLink />
		<Header />
		<main id="main-content" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
			{children}
		</main>
		<Footer />
	</div>
);

export default SiteShell;
