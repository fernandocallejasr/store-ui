import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme, THEME_STORAGE_KEY } from "./themeContextValue";

const getInitialTheme = (): Theme => {
	if (typeof window === "undefined")
		return "light";
	
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

	if (stored === "light" || stored === "dark")
		return stored;

	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", theme === "dark");
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	}, [theme]);

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const handler = (e: MediaQueryListEvent) => {
			if (window.localStorage.getItem(THEME_STORAGE_KEY)) 
				return;
			
			setTheme(e.matches ? "dark" : "light");
		};

		media.addEventListener("change", handler);

		return () => media.removeEventListener("change", handler);
	}, []);

	const toggleTheme = () => setTheme((prev) => (
		prev === "dark" ? "light" : "dark"
	));

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
