import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Container from "../common/Container";
import { focusRing } from "../common/buttonStyles";

const footerLinkClass = `rounded-sm font-medium text-slate-900 transition-colors hover:text-primary dark:text-slate-200 ${focusRing}`;

const Footer = () => {
	return (
		<footer className="border-t border-slate-200 dark:border-slate-700">
			<Container className="flex flex-col gap-2 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
				<p>© Stickers Shop</p>
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<span>
						Built with{" "}
						<FontAwesomeIcon icon={faHeart} className="text-primary" aria-hidden="true" />
						{" "}by{" "}
						<a
							href="https://github.com/fernandocallejasr"
							target="_blank"
							rel="noopener noreferrer"
							className={footerLinkClass}
						>
							fernandocallejasr
						</a>
					</span>
					<Link to="/contact" className={footerLinkClass}>
						Contact
					</Link>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
