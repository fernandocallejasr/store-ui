import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";

// The decorative photo half of the login and register screens.
const AuthHero = () => (
	<div
		aria-hidden="true"
		className="relative hidden bg-slate-900 bg-[url('/login-hero.jpg')] bg-cover bg-center md:block"
	>
		<div className="absolute inset-0 bg-slate-950/40" />
		<p className="absolute bottom-8 left-8 flex items-center gap-2 text-lg font-semibold tracking-tight text-white">
			<FontAwesomeIcon icon={faStore} className="h-5 w-5" />
			Stickers Shop
		</p>
	</div>
);

export default AuthHero;
