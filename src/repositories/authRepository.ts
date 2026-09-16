import apiClient from "../api/apiClient";
import type { LoginCredentials, LoginResponse, User } from "../components/auth/types";

const LOGIN_URL_PATH = "/auth/login";

const isUserShape = (value: unknown): boolean => {
	if (typeof value !== "object" || value === null)
		return false;

	return typeof (value as Partial<User>).name === "string";
};

const isLoginResponse = (value: unknown): value is LoginResponse => {
	if (typeof value !== "object" || value === null || Array.isArray(value))
		return false;

	const { message, user, jwtToken } = value as Partial<LoginResponse>;

	if (typeof message !== "string")
		return false;

	if (jwtToken != null && typeof jwtToken !== "string")
		return false;

	if (user != null && !isUserShape(user))
		return false;

	return true;
};

// No Authorization header: PublicPathConfig lists /api/v1/auth/** and
// StickerStoreSecurityConfig permits it, so the endpoint is open.
export const login = async (
	credentials: LoginCredentials,
	signal?: AbortSignal,
): Promise<LoginResponse> => {
	// Deliberately typed unknown, not LoginResponse: the generic would assert a
	// shape nobody has verified and let a stray HTML body through untouched.
	const { data } = await apiClient.post<unknown>(LOGIN_URL_PATH, credentials, { signal });

	if (!isLoginResponse(data))
		throw new Error("Login failed: the response body was not a LoginResponse");

	return data;
};
