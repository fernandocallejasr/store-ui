import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { getProfile } from "../repositories/profileRepository";
import { LOGIN_PATH, REDIRECT_PATH_STORAGE_KEY } from "../components/auth/ProtectedRoute";
import { SESSION_STORAGE_KEY } from "../context/authContextValue";
import { parseStoredSession } from "../context/sessionValidation";
import { endSession } from "../context/sessionEvents";
import { safeLocalStorage, safeSessionStorage } from "../lib/safeStorage";
import type { User } from "../components/auth/types";

// 401: the token is missing, malformed or expired.
// 404: the account was deleted after the token was issued.
// Either way the session is no longer usable.
const SESSION_REJECTED_STATUSES = [401, 404];

const isSessionRejected = (error: unknown): boolean =>
	axios.isAxiosError(error) &&
	SESSION_REJECTED_STATUSES.includes(error.response?.status ?? 0);

const hasStoredSession = (): boolean =>
	parseStoredSession(safeLocalStorage.read(SESSION_STORAGE_KEY)) !== null;

const redirectToLogin = (request: Request): Response => {
	safeSessionStorage.write(REDIRECT_PATH_STORAGE_KEY, new URL(request.url).pathname);
	return redirect(LOGIN_PATH);
};

export type ProfileLoaderArgs = Pick<LoaderFunctionArgs, "request">;

export const profileLoader = async ({ request }: ProfileLoaderArgs): Promise<User> => {
	if (!hasStoredSession()) {
		endSession();
		throw redirectToLogin(request);
	}

	try {
		return await getProfile(request.signal);
	} catch (error) {
		if (!isSessionRejected(error))
			throw error;

		endSession();
		throw redirectToLogin(request);
	}
};
