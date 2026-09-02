import apiClient from "../api/apiClient";
import type { LoginCredentials, LoginResponse } from "../components/auth/types";

const LOGIN_URL_PATH = "/auth/login";

// No Authorization header: PublicPathConfig lists /api/v1/auth/** and
// StickerStoreSecurityConfig permits it, so the endpoint is open.
export const login = async (
	credentials: LoginCredentials,
	signal?: AbortSignal,
): Promise<LoginResponse> => {
	const { data } = await apiClient.post<LoginResponse>(LOGIN_URL_PATH, credentials, { signal });
	return data;
};
