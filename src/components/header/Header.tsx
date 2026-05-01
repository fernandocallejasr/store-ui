import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket, faStore } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "../common/ThemeToggle";

const Header = () => {
	const navLinkClass =
    "text-center text-lg font-primary font-semibold text-primary py-2";

	return (
		<header className="border-b border-gray-300 dark:border-gray-700 sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 shadow-md">
			<div className="flex items-center justify-between mx-auto max-w-6xl px-6 py-4">
				<a href="/" className={navLinkClass}>
					<FontAwesomeIcon icon={faStore} className="h-8 w-8 mr-2 text-primary"/>
					<span className="font-bold">Stickers Shop</span>
				</a>
				<nav className="hidden lg:flex items-center py-2 z-10">
					<ul className="flex items-center space-x-6">
						<li><ThemeToggle /></li>
						<li><a href="/" className={navLinkClass}>Home</a></li>
						<li><a href="/" className={navLinkClass}>About</a></li>
						<li><a href="/" className={navLinkClass}>Contact</a></li>
						<li><a href="/" className={navLinkClass}>Login</a></li>
						<li>
							<a href="/" className="text-primary py-2">
								<FontAwesomeIcon icon={faShoppingBasket}/>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default Header;