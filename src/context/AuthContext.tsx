import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, SESSION_STORAGE_KEY, type AuthContextValue } from "./authContextValue";
import { isJwtShaped, parseStoredSession, toAuthUser } from "./sessionValidation";
import { onSessionEnded } from "./sessionEvents";
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

		const next = { jwtToken, user: toAuthUser(user) };

		// Stored now rather than by the effect below: Login navigates straight after
		// this call, and the next route's loader reads the session from storage
		// before React re-renders.
		storeSession(next);
		setSession(next);
	}, []);

	const logOut = useCallback(() => {
		storeSession(null);
		setSession(null);
	}, []);

	// A layout effect subscribes in the same task as the first render. The router
	// starts loaders before React renders, and a passive effect would leave a gap
	// in which one of them could end the session unheard.
	useLayoutEffect(() => onSessionEnded(logOut), [logOut]);

	// loginSuccess and logOut persist their own changes. On mount this also
	// overwrites storage with the validated session, which drops contact details
	// saved by older versions and removes data that is not a valid session.
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