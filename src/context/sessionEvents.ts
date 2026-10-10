import { SESSION_STORAGE_KEY } from "./authContextValue";
import { safeLocalStorage } from "../lib/safeStorage";

const SESSION_ENDED_EVENT = "session-ended";
const sessionEvents = new EventTarget();

// For code outside React, such as route loaders, that cannot reach logOut()
// through useAuth(). Storage is cleared here too, so the token is gone even if
// AuthProvider has not rendered yet.
export const endSession = () => {
	safeLocalStorage.clear(SESSION_STORAGE_KEY);
	sessionEvents.dispatchEvent(new Event(SESSION_ENDED_EVENT));
};

export const onSessionEnded = (listener: () => void): (() => void) => {
	sessionEvents.addEventListener(SESSION_ENDED_EVENT, listener);
	return () => sessionEvents.removeEventListener(SESSION_ENDED_EVENT, listener);
};
