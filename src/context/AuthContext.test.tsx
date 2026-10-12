import { useEffect } from "react";
import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "./useAuth";
import { SESSION_STORAGE_KEY } from "./authContextValue";
import { CART_STORAGE_KEY } from "./cartContextValue";
import { endSession } from "./sessionEvents";
import type { AuthUser, Session, User } from "../components/auth/types";

const testUser: User = {
	userId: 1,
	name: "My User",
	email: "myuser@example.com",
	mobileNumber: "5550000",
};

const storedUser: AuthUser = { userId: 1, name: "My User" };
const testSession: Session = { jwtToken: "a.b.c", user: storedUser };

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<AuthProvider>{children}</AuthProvider>
);

const seedStorage = (session: unknown) =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));

// Simulates a browser that refuses localStorage: with site data blocked, or in
// some embedded contexts, the call throws instead of returning null.
const breakStorage = (method: "getItem" | "setItem" | "removeItem", name: string) =>
	vi.spyOn(Storage.prototype, method).mockImplementation(() => {
		throw new DOMException("storage is not available", name);
	});

// jsdom does not deliver storage events between windows, so this stands in for
// another tab: it changes storage, then fires the event that change raises here.
// A null key is localStorage.clear().
const changeInAnotherTab = (key: string | null, newValue: string | null) => {
	act(() => {
		if (key === null)
			localStorage.clear();
		else if (newValue === null)
			localStorage.removeItem(key);
		else
			localStorage.setItem(key, newValue);

		window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
	});
};

describe("AuthProvider + useAuth", () => {
	beforeEach(() => {
		localStorage.clear();
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("useAuth returns a safe default when used outside the provider", async () => {
		const Probe = () => {
			const { isAuthenticated, logOut } = useAuth();
			return <button onClick={logOut}>{String(isAuthenticated)}</button>;
		};

		render(<Probe />);

		const button = screen.getByRole("button");
		expect(button).toHaveTextContent("false");
		await userEvent.click(button);
		// No provider => no-op, nothing throws and nothing changes.
		expect(button).toHaveTextContent("false");
	});

	it("starts anonymous when nothing is stored", () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
	});

	it("restores the session from storage on mount", () => {
		seedStorage(testSession);

		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.session).toEqual(testSession);
	});

	it("drops contact details left in a stored session", () => {
		// A full User inside the session must come back sanitised rather than
		// re-exposing email and mobileNumber.
		seedStorage({ jwtToken: "a.b.c", user: testUser });

		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.session?.user).toEqual(storedUser);
		expect(result.current.session?.user).not.toHaveProperty("email");
		expect(result.current.session?.user).not.toHaveProperty("mobileNumber");
		expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)!)).toEqual(testSession);
	});

	it.each([
		["text that isn't JSON at all", "{not json"],
		["the literal null", "null"],
		["a bare number", "42"],
		["an array", "[]"],
		["an empty token", '{"jwtToken":"","user":{"userId":1,"name":"My User"}}'],
		["a missing token", '{"user":{"userId":1,"name":"My User"}}'],
		["a non-string token", '{"jwtToken":123,"user":{"userId":1,"name":"My User"}}'],
		["a token that is not a JWT", '{"jwtToken":"not-a-jwt","user":{"userId":1,"name":"My User"}}'],
		["a token but no user", '{"jwtToken":"a.b.c"}'],
		["a userId of the wrong type", '{"jwtToken":"a.b.c","user":{"userId":"1","name":"My User"}}'],
		["a user with no name", '{"jwtToken":"a.b.c","user":{"userId":1}}'],
	])("treats %s in storage as no session, without throwing", (_label, stored) => {
		localStorage.setItem(SESSION_STORAGE_KEY, stored);

		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.session).toBeNull();
		expect(result.current.isAuthenticated).toBe(false);
	});

	it("loginSuccess authenticates and persists the whole session", () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => result.current.loginSuccess("a.b.c", testUser));

		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.session).toEqual(testSession);
		expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)!)).toEqual(testSession);
	});

	// Inside act() nothing re-renders until the callback returns, so these see
	// storage as a loader started by the same navigation would.
	it("loginSuccess persists the session before React re-renders", () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => {
			result.current.loginSuccess("a.b.c", testUser);
			expect(JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)!)).toEqual(testSession);
		});
	});

	it("logOut clears storage before React re-renders", () => {
		seedStorage(testSession);
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => {
			result.current.logOut();
			expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
		});
	});

	it("loginSuccess refuses an empty token and leaves the session alone", () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => result.current.loginSuccess("", testUser));

		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	it.each([
		["a token that is not a JWT", "not-a-jwt"],
		["a token carrying a CRLF", "a.b.c\r\nX-Injected: 1"],
	])("loginSuccess refuses %s", (_label, jwtToken) => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => result.current.loginSuccess(jwtToken, testUser));

		// A session the API client would refuse to send must not be one the UI
		// believes in either.
		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	it("loginSuccess with an empty token does not clobber an existing session", () => {
		seedStorage(testSession);
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => result.current.loginSuccess("", testUser));

		expect(result.current.session).toEqual(testSession);
	});

	it("never writes the user's contact details to storage", () => {
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => result.current.loginSuccess("a.b.c", testUser));

		const written = localStorage.getItem(SESSION_STORAGE_KEY) ?? "";
		expect(written).not.toContain(testUser.email);
		expect(written).not.toContain(testUser.mobileNumber);
	});

	it("logOut clears the session and removes it from storage", () => {
		seedStorage(testSession);
		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.isAuthenticated).toBe(true);
		expect(result.current.session).not.toBeNull();

		act(() => result.current.logOut());

		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	it("logs out when the session is ended from outside React", () => {
		seedStorage(testSession);
		const { result } = renderHook(() => useAuth(), { wrapper });

		act(() => endSession());

		expect(result.current.isAuthenticated).toBe(false);
		expect(result.current.session).toBeNull();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	it("is listening before any passive effect can end the session", () => {
		seedStorage(testSession);
		const EndsSessionOnMount = () => {
			useEffect(() => endSession(), []);
			return null;
		};

		const { result } = renderHook(() => useAuth(), {
			wrapper: ({ children }: { children: React.ReactNode }) => (
				<AuthProvider>
					<EndsSessionOnMount />
					{children}
				</AuthProvider>
			),
		});

		expect(result.current.isAuthenticated).toBe(false);
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	describe("when another tab changes storage", () => {
		it("logs out when another tab removes the session", () => {
			seedStorage(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(SESSION_STORAGE_KEY, null);

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.session).toBeNull();
		});

		it("picks up a session that another tab stored", () => {
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(SESSION_STORAGE_KEY, JSON.stringify(testSession));

			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.session).toEqual(testSession);
		});

		it("treats an invalid session from another tab as logged out", () => {
			seedStorage(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(
				SESSION_STORAGE_KEY,
				'{"jwtToken":"not-a-jwt","user":{"userId":1,"name":"My User"}}',
			);

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.session).toBeNull();
		});

		it("logs out when another tab clears all of storage", () => {
			seedStorage(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(null, null);

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.session).toBeNull();
		});

		it("ignores changes to other keys", () => {
			seedStorage(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(CART_STORAGE_KEY, "[]");

			expect(result.current.session).toEqual(testSession);
		});

		it("leaves another tab's session in storage exactly as that tab wrote it", () => {
			const written = JSON.stringify(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });

			changeInAnotherTab(SESSION_STORAGE_KEY, written);

			// Browsers fire no storage event for a write that leaves the value as it
			// was, so the tabs do not echo the change back and forth.
			expect(result.current.session).toEqual(testSession);
			expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBe(written);
		});
	});

	describe("when the browser refuses localStorage", () => {
		it("starts anonymous instead of throwing during render", () => {
			breakStorage("getItem", "SecurityError");

			const { result } = renderHook(() => useAuth(), { wrapper });

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.session).toBeNull();
		});

		it("keeps the session in memory when the write fails", () => {
			breakStorage("setItem", "QuotaExceededError");
			const { result } = renderHook(() => useAuth(), { wrapper });

			act(() => result.current.loginSuccess("a.b.c", testUser));

			// The session is unusable after a reload, but the current page must
			// keep working rather than crashing.
			expect(result.current.isAuthenticated).toBe(true);
			expect(result.current.session).toEqual(testSession);
		});

		it("logs out cleanly when clearing storage fails", () => {
			seedStorage(testSession);
			const { result } = renderHook(() => useAuth(), { wrapper });
			breakStorage("removeItem", "SecurityError");

			act(() => result.current.logOut());

			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.session).toBeNull();
		});
	});

	it("hands consumers the same context object across re-renders", () => {
		const { result, rerender } = renderHook(() => useAuth(), { wrapper });
		const firstValue = result.current;

		rerender();

		// The useMemo in AuthProvider is what keeps this identity stable; without
		// it every consumer re-renders whenever anything above the provider does.
		expect(result.current).toBe(firstValue);
	});
});
