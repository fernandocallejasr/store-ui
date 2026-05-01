import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "./ThemeContext";
import { useTheme } from "./useTheme";

type MediaListener = (e: MediaQueryListEvent) => void;

const setupMatchMedia = (initialMatches: boolean) => {
	const listeners = new Set<MediaListener>();
	const mql = {
		matches: initialMatches,
		media: "(prefers-color-scheme: dark)",
		addEventListener: (_: string, l: MediaListener) => listeners.add(l),
		removeEventListener: (_: string, l: MediaListener) => listeners.delete(l),
		addListener: () => {},
		removeListener: () => {},
		dispatchEvent: () => false,
		onchange: null,
	} as unknown as MediaQueryList;

	window.matchMedia = vi.fn().mockReturnValue(mql);

	return {
		emit: (matches: boolean) => {
			(mql as unknown as { matches: boolean }).matches = matches;
			listeners.forEach((l) => l({ matches } as MediaQueryListEvent));
		},
	};
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<ThemeProvider>{children}</ThemeProvider>
);

describe("ThemeProvider + useTheme", () => {
	beforeEach(() => {
		localStorage.clear();
		document.documentElement.classList.remove("dark");
		setupMatchMedia(false);
	});

	it("defaults to light when no preference and no override", () => {
		const { result } = renderHook(() => useTheme(), { wrapper });
		expect(result.current.theme).toBe("light");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("uses system preference when no localStorage override", () => {
		setupMatchMedia(true);
		const { result } = renderHook(() => useTheme(), { wrapper });
		expect(result.current.theme).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});

	it("prefers localStorage over system preference", () => {
		setupMatchMedia(true);
		localStorage.setItem("theme", "light");
		const { result } = renderHook(() => useTheme(), { wrapper });
		expect(result.current.theme).toBe("light");
	});

	it("toggleTheme flips theme and persists to localStorage", () => {
		const { result } = renderHook(() => useTheme(), { wrapper });
		expect(result.current.theme).toBe("light");

		act(() => result.current.toggleTheme());

		expect(result.current.theme).toBe("dark");
		expect(localStorage.getItem("theme")).toBe("dark");
		expect(document.documentElement.classList.contains("dark")).toBe(true);

		act(() => result.current.toggleTheme());

		expect(localStorage.getItem("theme")).toBe("light");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});

	it("responds to system preference changes when no override is set", () => {
		const media = setupMatchMedia(false);
		const { result } = renderHook(() => useTheme(), { wrapper });

		// Provider's mount effect writes initial theme to localStorage,
		// so clear it to simulate "no override".
		localStorage.removeItem("theme");

		act(() => media.emit(true));

		expect(result.current.theme).toBe("dark");
	});

	it("ignores system preference changes when an override is set", () => {
		const media = setupMatchMedia(false);
		localStorage.setItem("theme", "light");
		const { result } = renderHook(() => useTheme(), { wrapper });

		act(() => media.emit(true));

		expect(result.current.theme).toBe("light");
	});

	it("useTheme returns a safe default when used outside the provider", async () => {
		const Probe = () => {
			const { theme, toggleTheme } = useTheme();
			return (
				<button onClick={toggleTheme}>{theme}</button>
			);
		};

		render(<Probe />);
		
		const button = screen.getByRole("button");
		expect(button).toHaveTextContent("light");
		await userEvent.click(button);
		expect(button).toHaveTextContent("light");
	});
});
