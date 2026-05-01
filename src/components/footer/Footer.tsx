import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
	return (
		<footer className="flex justify-center items-center py-4 font-primary text-gray-700 dark:text-gray-300">
			Built with
			<FontAwesomeIcon 
				icon={faHeart} 
				className="text-red-600 mx-1 animate-pulse" 
				aria-hidden="true"
			/>
			by 
			<a 
				href="https://github.com/fernandocallejasr"
				target="_blank"
				rel="noopener noreferrer"
				className="text-primary font-semibold px-1 transition-colors duration-300 hover:text-dark"
			>
				 fernandocallejasr
			</a>
		</footer>
	);
};

export default Footer;