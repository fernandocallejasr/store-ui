import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, SESSION_STORAGE_KEY, type AuthContextValue } from "./authContextValue";
import { isJwtShaped, parseStoredSession, toAuthUser } from "./sessionValidation";
import type { Session, User } from "../components/auth/types";
import { safeLocalStorage } from "../lib/safeStorage";

function getInitialSession(): Session | null {
	return parseStoredSession(safeLocalStorage.read(SESSION_STORAGE_KEY));
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
		if (!isJwtShaped(jwtToken)) {
			if (import.meta.env.DEV)
				console.warn("[auth] loginSuccess ignored: jwtToken is not a JWT");

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