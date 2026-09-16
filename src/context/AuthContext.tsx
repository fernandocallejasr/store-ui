import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, SESSION_STORAGE_KEY, type AuthContextValue } from "./authContextValue";
import type { AuthUser, Session, User } from "../components/auth/types";
import { safeLocalStorage } from "../lib/safeStorage";

const toAuthUser = (user: AuthUser): AuthUser => ({ userId: user.userId, name: user.name });

function getInitialSession(): Session | null {
	const storedSession = safeLocalStorage.read(SESSION_STORAGE_KEY);
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
		safeLocalStorage.clear(SESSION_STORAGE_KEY);
		return;
	}

	safeLocalStorage.write(SESSION_STORAGE_KEY, JSON.stringify(session));
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