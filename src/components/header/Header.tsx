import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faStore } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "../common/ThemeToggle";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
	const navLinkClass =
	"text-center text-lg font-primary font-semibold text-primary py-2";

	const navLinkClassFn = ({ isActive }: { isActive: boolean }) =>
		isActive ? `underline ${navLinkClass}` : navLinkClass;

	return (
		<header className="border-b border-gray-300 dark:border-gray-700 sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 shadow-md">
			<div className="flex items-center justify-between mx-auto max-w-6xl px-6 py-4">
				<Link to="/" className={navLinkClass}>
					<FontAwesomeIcon icon={faStore} className="h-8 w-8 mr-2 text-primary"/>
					<span className="font-bold">Stickers Shop</span>
				</Link>
				<nav className="hidden lg:flex items-center py-2 z-10">
					<ul className="flex items-center space-x-6">
						<li><ThemeToggle /></li>
						<li>
							<NavLink to="/" className={navLinkClassFn}>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink to="/about" className={navLinkClassFn}>
								About
							</NavLink>
						</li>
						<li>
							<NavLink to="/contact" className={navLinkClassFn}>
								Contact
							</NavLink>
						</li>
						<li>
							<NavLink to="/login" className={navLinkClassFn}>
								Login
							</NavLink>
						</li>
						<li>
							<NavLink to="/cart" className={navLinkClass}>
								<FontAwesomeIcon icon={faShoppingBasket}/>
							</NavLink>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;