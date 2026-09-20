import apiClient from "../api/apiClient";
import type {
	LoginCredentials,
	LoginResponse,
	RegisterCredentials,
	User,
} from "../components/auth/types";

const LOGIN_URL_PATH = "/auth/login";
const REGISTER_URL_PATH = "/auth/register";
const CREATED_STATUS = 201;

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

// The body is not worth validating - it is the plain string "Registration
// successful" and the caller only redirects - but the status is. A 2xx does not
// prove the account exists: a CloudFront Custom Error Response turns a failed
// POST into a 200 serving index.html, which axios resolves happily. login()
// refuses that body for the same reason; here the status is all there is to
// check, and announcing an account that was never created is the worse lie.
export const register = async (
	credentials: RegisterCredentials,
	signal?: AbortSignal,
): Promise<void> => {
	const { status } = await apiClient.post(REGISTER_URL_PATH, credentials, { signal });

	if (status !== CREATED_STATUS)
		throw new Error(`Registration failed: expected 201 Created but the server answered ${status}`);
};
