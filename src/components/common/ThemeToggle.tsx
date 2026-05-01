import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/useTheme";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle dark mode"
			aria-pressed={isDark}
			className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-primary text-primary transition-colors hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 dark:hover:text-white"
		>
			<FontAwesomeIcon icon={isDark ? faSun : faMoon} />
		</button>
	);
};

export default ThemeToggle;
