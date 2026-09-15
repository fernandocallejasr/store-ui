import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, SESSION_STORAGE_KEY, type AuthContextValue } from "./authContextValue";
import type { AuthUser, Session, User } from "../components/auth/types";

const toAuthUser = (user: AuthUser): AuthUser => ({ userId: user.userId, name: user.name });

const warnStorage = (action: string, error: unknown) => {
	if (import.meta.env.DEV)
		console.warn(`[auth] could not ${action} localStorage`, error);
};

const readStorage = (key: string): string | null => {
	try {
		return window.localStorage.getItem(key);
	} catch (error) {
		warnStorage("read", error);
		return null;
	}
};

const writeStorage = (key: string, value: string) => {
	try {
		window.localStorage.setItem(key, value);
	} catch (error) {
		warnStorage("write to", error);
	}
};

const clearStorage = (key: string) => {
	try {
		window.localStorage.removeItem(key);
	} catch (error) {
		warnStorage("clear", error);
	}
};

function getInitialSession(): Session | null {
	const storedSession = readStorage(SESSION_STORAGE_KEY);
	if (!storedSession)
		return null;

	let parsed: { jwtToken?: unknown; user?: Partial<AuthUser> };

	try {
		parsed = JSON.parse(storedSession);
	} catch {
		return null;
	}

	// Storage is user-writable, so a session is restored only when every part of
	// it is well-formed. Anything else is no session at all — never a partial
	// one, which is the state this shape exists to rule out.
	if (typeof parsed?.jwtToken !== "string" || !parsed.jwtToken)
		return null;

	const user = parsed.user;
	if (typeof user?.userId !== "number" || typeof user?.name !== "string")
		return null;

	return { jwtToken: parsed.jwtToken, user: toAuthUser(user as AuthUser) };
}

function storeSession(session: Session | null) {
	if (session == null) {
		clearStorage(SESSION_STORAGE_KEY);
		return;
	}

	writeStorage(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export const AuthProvider = ({ children } : { children: ReactNode }) => {
	const [session, setSession] = useState<Session | null>(getInitialSession);

	const isAuthenticated = session !== null;

	const loginSuccess = useCallback((jwtToken: string, user: User) => {
		if (!jwtToken) {
			if (import.meta.env.DEV)
				console.warn("[auth] loginSuccess ignored: empty jwtToken");

			return;
		}

		setSession({ jwtToken, user: toAuthUser(user) });
	}, []);

	const logOut = useCallback(() => setSession(null), []);

	useEffect(() => {
		storeSession(session);
	}, [session]);

	const authContextValue = useMemo<AuthContextValue>(() => (
		{ session, isAuthenticated, loginSuccess, logOut }
	),[session, isAuthenticated, loginSuccess, logOut]);

	return (
		<AuthContext.Provider value={authContextValue}>
			{children}
		</AuthContext.Provider>
	);
};