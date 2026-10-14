import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../../context/useTheme";
import { focusRing } from "./buttonStyles";

const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label="Toggle dark mode"
			aria-pressed={isDark}
			className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-700 ${focusRing}`}
		>
			<FontAwesomeIcon icon={isDark ? faSun : faMoon} aria-hidden="true" />
		</button>
	);
};

export default ThemeToggle;
