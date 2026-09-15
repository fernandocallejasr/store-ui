import { createContext } from "react";
import type { Session, User } from "../components/auth/types";

export const SESSION_STORAGE_KEY = "session";

export interface AuthContextValue {
	session: Session | null;
	isAuthenticated: boolean;
	loginSuccess: (jwtToken: string, user: User) => void;
	logOut: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
	session: null,
	isAuthenticated: false,
	loginSuccess: () => {},
	logOut: () => {},
});
