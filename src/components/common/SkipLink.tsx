import { focusRing } from "./buttonStyles";

const SkipLink = () => (
	<a
		href="#main-content"
		className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary ${focusRing}`}
	>
		Skip to content
	</a>
);

export default SkipLink;
