import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { SESSION_STORAGE_KEY } from "../context/authContextValue";

const API_BASE_URL = "https://api.example.test/api/v1";
const API_ORIGIN = "https://api.example.test";
const EVIL_ORIGIN = "https://evil.example";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc-DEF_123";

type Env = Partial<Record<"VITE_API_BASE_URL" | "VITE_AXIOS_DEFAULT_TIMEOUT", string | undefined>>;

// apiClient reads its environment once, when the module is first evaluated, so
// every test imports a fresh copy built against the environment it needs.
const loadApiClient = async (env: Env = {}): Promise<AxiosInstance> => {
	vi.resetModules();

	const resolved: Env = { VITE_API_BASE_URL: API_BASE_URL, VITE_AXIOS_DEFAULT_TIMEOUT: "5000", ...env };
	for (const [name, value] of Object.entries(resolved))
		vi.stubEnv(name, value);

	return (await import("./apiClient")).default;
};

// Stands in for the network. An adapter is handed the request after every
// interceptor has run - exactly what would leave the browser.
// send also fails if the request never reaches the adapter, so no test can
// pass just because nothing was sent.
const send = async (apiClient: AxiosInstance, config: AxiosRequestConfig = {}) => {
	let sent: InternalAxiosRequestConfig | undefined;

	await apiClient.request({
		url: "/products",
		...config,
		adapter: async (request) => {
			sent = request;
			return { data: null, status: 200, statusText: "OK", headers: {}, config: request };
		},
	});

	if (!sent)
		throw new Error("The request never reached the network");

	return sent;
};

// Where the request would really go: getUri runs the same baseURL/absolute-URL
// resolution as the XHR adapter, and the browser resolves what is left of a
// relative URL against the page.
const destinationOf = (apiClient: AxiosInstance, request: InternalAxiosRequestConfig) =>
	new URL(apiClient.getUri(request), document.baseURI);

const seedSession = (jwtToken: unknown = TOKEN) =>
	localStorage.setItem(
		SESSION_STORAGE_KEY,
		JSON.stringify({ jwtToken, user: { userId: 1, name: "My User" } }),
	);

describe("apiClient", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	describe("Authorization header", () => {
		it("sends the stored session's token as a Bearer token", async () => {
			seedSession();
			const apiClient = await loadApiClient();

			const request = await send(apiClient);

			expect(request.headers.Authorization).toBe(`Bearer ${TOKEN}`);
		});

		it("sends no Authorization header when nobody is signed in", async () => {
			const apiClient = await loadApiClient();

			const request = await send(apiClient);

			expect(request.headers.Authorization).toBeUndefined();
		});

		it.each([
			["a non-string token", 123],
			["an object for a token", { value: TOKEN }],
			["a token that is not a JWT", "not-a-jwt"],
			["a token carrying a CRLF", `${TOKEN}\r\nX-Injected: 1`],
		])("sends no Authorization header for a stored session with %s", async (_label, jwtToken) => {
			seedSession(jwtToken);
			const apiClient = await loadApiClient();

			const request = await send(apiClient);

			expect(request.headers.Authorization).toBeUndefined();
		});

		it("sends no Authorization header for a token whose session has no user", async () => {
			// The auth context treats this as signed out; the API client must agree
			// rather than authenticate a user the UI says is not there.
			localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ jwtToken: TOKEN }));
			const apiClient = await loadApiClient();

			const request = await send(apiClient);

			expect(request.headers.Authorization).toBeUndefined();
		});

		it("reads the session per request, so signing in and out takes effect at once", async () => {
			const apiClient = await loadApiClient();

			seedSession();
			expect((await send(apiClient)).headers.Authorization).toBe(`Bearer ${TOKEN}`);

			localStorage.removeItem(SESSION_STORAGE_KEY);
			expect((await send(apiClient)).headers.Authorization).toBeUndefined();
		});

		it("still sends the request, unauthenticated, when the browser refuses storage", async () => {
			vi.spyOn(console, "warn").mockImplementation(() => {});
			seedSession();
			vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
				throw new DOMException("storage is not available", "SecurityError");
			});
			const apiClient = await loadApiClient();

			const request = await send(apiClient);

			expect(request.headers.Authorization).toBeUndefined();
		});
	});

	describe("keeping the token on the API's origin", () => {
		it.each([
			["an absolute URL", `${EVIL_ORIGIN}/collect`],
			["a protocol-relative URL", "//evil.example/collect"],
		])("joins %s onto the API base instead of following it", async (_label, url) => {
			const apiClient = await loadApiClient();

			const request = await send(apiClient, { url });

			expect(destinationOf(apiClient, request).origin).toBe(API_ORIGIN);
		});

		it.each([
			["re-enables absolute URLs", { url: `${EVIL_ORIGIN}/collect`, allowAbsoluteUrls: true }, EVIL_ORIGIN],
			["swaps in another host's base URL", { baseURL: `${EVIL_ORIGIN}/api/v1` }, EVIL_ORIGIN],
			["uses a host that merely starts with the API's", { baseURL: `${API_ORIGIN}.evil.example/api/v1` }, `${API_ORIGIN}.evil.example`],
			["targets another port on the API host", { baseURL: `${API_ORIGIN}:8443/api/v1` }, `${API_ORIGIN}:8443`],
			["downgrades the API host to plain http", { baseURL: "http://api.example.test/api/v1" }, "http://api.example.test"],
		])("withholds the token from a request that %s", async (_label, config, expectedOrigin) => {
			seedSession();
			const apiClient = await loadApiClient();

			const request = await send(apiClient, config);

			// The request really is leaving for the other origin - axios honours a
			// per-request override - which is exactly why the token must not ride along.
			expect(destinationOf(apiClient, request).origin).toBe(expectedOrigin);
			expect(request.headers.Authorization).toBeUndefined();
		});

		it("withholds the token when the destination cannot be worked out", async () => {
			seedSession();
			const apiClient = await loadApiClient();

			const request = await send(apiClient, { baseURL: "http://[" });

			expect(request.headers.Authorization).toBeUndefined();
		});

		describe("with a relative API base, as served in production", () => {
			it("sends the token to the page's own origin", async () => {
				seedSession();
				const apiClient = await loadApiClient({ VITE_API_BASE_URL: "/api/" });

				const request = await send(apiClient);

				expect(destinationOf(apiClient, request).href).toBe(new URL("/api/products", document.baseURI).href);
				expect(request.headers.Authorization).toBe(`Bearer ${TOKEN}`);
			});

			it("withholds the token from another origin", async () => {
				seedSession();
				const apiClient = await loadApiClient({ VITE_API_BASE_URL: "/api/" });

				const request = await send(apiClient, { url: `${EVIL_ORIGIN}/collect`, allowAbsoluteUrls: true });

				expect(destinationOf(apiClient, request).origin).toBe(EVIL_ORIGIN);
				expect(request.headers.Authorization).toBeUndefined();
			});
		});

		describe("with no API base configured, as an unset CI variable arrives", () => {
			it.each([
				["empty", ""],
				["missing", undefined],
			])("withholds the token from an absolute URL when the base is %s", async (_label, base) => {
				seedSession();
				const apiClient = await loadApiClient({ VITE_API_BASE_URL: base });

				const request = await send(apiClient, { url: `${EVIL_ORIGIN}/collect` });

				expect(destinationOf(apiClient, request).origin).toBe(EVIL_ORIGIN);
				expect(request.headers.Authorization).toBeUndefined();
			});
		});
	});

	describe("timeout", () => {
		it("uses the configured timeout", async () => {
			const apiClient = await loadApiClient({ VITE_AXIOS_DEFAULT_TIMEOUT: "2500" });

			const request = await send(apiClient);

			expect(request.timeout).toBe(2500);
		});

		it.each([
			["empty", ""],
			["missing", undefined],
			["not a number", "ten seconds"],
			["zero", "0"],
			["negative", "-1"],
		])("never sends a request without a timeout when the setting is %s", async (_label, value) => {
			const apiClient = await loadApiClient({ VITE_AXIOS_DEFAULT_TIMEOUT: value });

			const { timeout } = await send(apiClient);

			// NaN or 0 here reaches XHR as 0, which means "wait forever".
			expect(Number.isFinite(timeout)).toBe(true);
			expect(timeout).toBeGreaterThan(0);
		});
	});
});
