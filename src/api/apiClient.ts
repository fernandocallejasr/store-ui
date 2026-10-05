import axios, { type InternalAxiosRequestConfig } from "axios";
import { SESSION_STORAGE_KEY } from "../context/authContextValue";
import { parseStoredSession } from "../context/sessionValidation";
import { safeLocalStorage } from "../lib/safeStorage";

const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_TIMEOUT_MS = 10_000;

const resolveTimeout = (configured: unknown): number => {
	const timeout = Number(configured);
	return Number.isFinite(timeout) && timeout > 0 ? timeout : DEFAULT_TIMEOUT_MS;
};

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	// By default axios ignores baseURL whenever it is handed an absolute or
	// protocol-relative URL, and the request - bearer token included - goes
	// wherever that URL points. With this off, every URL is joined onto the base.
	allowAbsoluteUrls: false,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json"
	},
	timeout: resolveTimeout(import.meta.env.VITE_AXIOS_DEFAULT_TIMEOUT)
});

const readJwtToken = (): string | null =>
	parseStoredSession(safeLocalStorage.read(SESSION_STORAGE_KEY))?.jwtToken ?? null;

// allowAbsoluteUrls can be switched back on per request, and baseURL replaced,
// so the token is attached only after working out where the request will really go. 
const isBoundForApi = (config: InternalAxiosRequestConfig): boolean => {
	try {
		const apiOrigin = new URL(API_BASE_URL ?? "", document.baseURI).origin;
		const destination = new URL(apiClient.getUri(config), document.baseURI);
		return destination.origin === apiOrigin;
	} catch {
		return false;
	}
};

apiClient.interceptors.request.use((config) => {
	const jwtToken = readJwtToken();
	if (jwtToken && isBoundForApi(config))
		config.headers.Authorization = `Bearer ${jwtToken}`;

	return config;
});

export default apiClient;
