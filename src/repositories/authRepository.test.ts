import type { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { login, register } from "./authRepository";
import type { LoginResponse, RegisterCredentials } from "../components/auth/types";

vi.mock("../api/apiClient", () => ({
	default: { post: vi.fn() },
}));

const credentials = { username: "myuser", password: "secret" };

const registration: RegisterCredentials = {
	name: "My User",
	email: "myuser@example.com",
	mobileNumber: "5550000000",
	password: "supersecret",
};

const loginResponse: LoginResponse = {
	message: "Correctly logged in",
	user: null,
	jwtToken: null,
};

// Takes unknown on purpose: these tests need to hand the repository the kind of
// body a real server can return, not only ones that satisfy LoginResponse.
const resolveWith = (body: unknown) =>
	vi.mocked(apiClient.post).mockResolvedValue({ data: body } as AxiosResponse<unknown>);

// Exactly what CloudFront returns when a 403 is rewritten to /index.html with
// status 200 — a resolved request whose body is the SPA shell.
const SPA_FALLBACK_HTML =
	'<!doctype html><html><head><title>Vite App</title></head><body><div id="root"></div></body></html>';

describe("authRepository.login", () => {
	beforeEach(() => {
		vi.mocked(apiClient.post).mockReset();
	});

	it("posts the credentials to the login endpoint with the abort signal", async () => {
		resolveWith(loginResponse);
		const controller = new AbortController();

		await login(credentials, controller.signal);

		expect(apiClient.post).toHaveBeenCalledWith("/auth/login", credentials, {
			signal: controller.signal,
		});
	});

	it("returns the response body unchanged", async () => {
		resolveWith(loginResponse);

		await expect(login(credentials)).resolves.toEqual(loginResponse);
	});

	it("passes a populated user and token straight through", async () => {
		const populated: LoginResponse = {
			message: "Correctly logged in",
			user: {
				userId: 1,
				name: "My User",
				email: "myuser@example.com",
				mobileNumber: "5550000",
			},
			jwtToken: "a.b.c",
		};
		resolveWith(populated);

		await expect(login(credentials)).resolves.toEqual(populated);
	});

	describe("when a 2xx carries a body that is not a LoginResponse", () => {
		it("rejects the SPA fallback page instead of reporting success", async () => {
			resolveWith(SPA_FALLBACK_HTML);

			await expect(login(credentials)).rejects.toThrow(/not a LoginResponse/);
		});

		it.each([
			["null", null],
			["a bare string", "OK"],
			["a number", 200],
			["an array", []],
			["an object with no message", { user: null, jwtToken: "a.b.c" }],
			["a non-string message", { message: 42, user: null, jwtToken: null }],
			["a non-string jwtToken", { message: "ok", user: null, jwtToken: 42 }],
			["a user that is not an object", { message: "ok", user: "My User", jwtToken: null }],
			["a user with no name", { message: "ok", user: { userId: 1 }, jwtToken: null }],
		])("rejects %s", async (_label, body) => {
			resolveWith(body);

			await expect(login(credentials)).rejects.toThrow(/not a LoginResponse/);
		});

		it.each([
			["both fields null", { message: "ok", user: null, jwtToken: null }],
			["both fields absent", { message: "ok" }],
		])("still accepts a valid response with %s", async (_label, body) => {
			resolveWith(body);

			await expect(login(credentials)).resolves.toEqual(body);
		});
	});

	it("lets a request failure propagate to the caller", async () => {
		const failure = new Error("Network Error");
		vi.mocked(apiClient.post).mockRejectedValue(failure);

		await expect(login(credentials)).rejects.toBe(failure);
	});
});

describe("authRepository.register", () => {
	// The endpoint commits to 201 Created, so the status is the whole contract
	// and the tests have to carry it.
	const resolveCreated = (body: unknown) =>
		vi.mocked(apiClient.post).mockResolvedValue({
			status: 201,
			data: body,
		} as AxiosResponse<unknown>);

	beforeEach(() => {
		vi.mocked(apiClient.post).mockReset();
	});

	it("posts the registration to the register endpoint with the abort signal", async () => {
		resolveCreated("Registration successful");
		const controller = new AbortController();

		await register(registration, controller.signal);

		expect(apiClient.post).toHaveBeenCalledWith("/auth/register", registration, {
			signal: controller.signal,
		});
	});

	// The body itself is not worth validating: it is the plain string
	// "Registration successful" and nothing downstream reads it. The status is.
	it.each([
		["the plain-text success body", "Registration successful"],
		["an empty body", ""],
		["a JSON body, should the endpoint ever return one", { message: "Registration successful" }],
	])("resolves with nothing given a 201 carrying %s", async (_label, body) => {
		resolveCreated(body);

		await expect(register(registration)).resolves.toBeUndefined();
	});

	// The reason this check exists at all. A CloudFront Custom Error Response
	// rewrites a failed POST into a 200 serving the SPA shell, so a request that
	// created nothing arrives looking like a success. login() already refuses to
	// be fooled by validating its body; register has only the status to go on,
	// and reporting a phantom account is worse than reporting a failure.
	it("rejects a 200 serving the SPA shell instead of reporting a phantom account", async () => {
		vi.mocked(apiClient.post).mockResolvedValue({
			status: 200,
			data: SPA_FALLBACK_HTML,
		} as AxiosResponse<unknown>);

		await expect(register(registration)).rejects.toThrow(/201/);
	});

	it.each([
		["200 OK", 200],
		["202 Accepted", 202],
		["204 No Content", 204],
	])("rejects a %s, which the endpoint never promises", async (_label, status) => {
		vi.mocked(apiClient.post).mockResolvedValue({
			status,
			data: "",
		} as AxiosResponse<unknown>);

		await expect(register(registration)).rejects.toThrow(/201/);
	});

	it("lets a request failure propagate to the caller", async () => {
		const failure = new Error("Network Error");
		vi.mocked(apiClient.post).mockRejectedValue(failure);

		await expect(register(registration)).rejects.toBe(failure);
	});
});
