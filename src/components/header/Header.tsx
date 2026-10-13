import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faStore } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { useAuth } from "../../context/useAuth";
import UserMenu from "../auth/UserMenu";
import Container from "../common/Container";
import ThemeToggle from "../common/ThemeToggle";
import { buttonClasses, focusRing } from "../common/buttonStyles";
import MobileMenu from "./MobileMenu";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
	[
		"rounded-sm text-sm font-medium transition-colors",
		focusRing,
		isActive
			? "text-primary underline decoration-2 underline-offset-8"
			: "text-slate-700 hover:text-primary dark:text-slate-300",
	].join(" ");

// The cart link sits outside both navs so it is never duplicated. The header is
// sticky, which makes it the positioning parent for the mobile menu's panel.
const Header = () => {
	const { totalQuantity } = useCart();
	const { isAuthenticated } = useAuth();
	const badgeLabel = totalQuantity > 99 ? "99+" : String(totalQuantity);

	return (
		<header className="sticky top-0 z-20 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
			<Container className="flex h-16 items-center justify-between gap-4">
				<Link to="/" className={`flex items-center gap-2 rounded-sm ${focusRing}`}>
					<FontAwesomeIcon icon={faStore} className="h-6 w-6 text-primary" aria-hidden="true" />
					<span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
						Stickers Shop
					</span>
				</Link>

				<div className="flex items-center gap-1 md:gap-6">
					<nav aria-label="Main" className="hidden md:block">
						<ul className="flex items-center gap-6">
							<li>
								<NavLink to="/" end className={navLinkClass}>
									Shop
								</NavLink>
							</li>
							<li>
								<NavLink to="/contact" className={navLinkClass}>
									Contact
								</NavLink>
							</li>
							<li>
								<ThemeToggle />
							</li>
							{isAuthenticated ? (
								<li>
									<UserMenu />
								</li>
							) : (
								<>
									<li>
										<NavLink to="/login" className={navLinkClass}>
											Log in
										</NavLink>
									</li>
									<li>
										<Link to="/register" className={buttonClasses({ variant: "secondary" })}>
											Register
										</Link>
									</li>
								</>
							)}
						</ul>
					</nav>

					<NavLink
						to="/cart"
						aria-label={`Cart, ${totalQuantity} ${totalQuantity === 1 ? "item" : "items"}`}
						className={({ isActive }) =>
							`relative inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${focusRing} ${
								isActive ? "text-primary" : "text-slate-700 hover:text-primary dark:text-slate-300"
							}`
						}
					>
						<FontAwesomeIcon icon={faShoppingBasket} className="h-5 w-5" aria-hidden="true" />
						<span
							aria-hidden="true"
							className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-mono text-xs font-semibold text-on-primary"
						>
							{badgeLabel}
						</span>
					</NavLink>

					<MobileMenu />
				</div>
			</Container>
		</header>
	);
};

export default Header;
