import type { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { login } from "./authRepository";
import type { LoginResponse } from "../components/auth/types";

vi.mock("../api/apiClient", () => ({
	default: { post: vi.fn() },
}));

const credentials = { username: "myuser", password: "secret" };

const loginResponse: LoginResponse = {
	message: "Correctly logged in",
	user: null,
	jwtToken: null,
};

const resolveWith = (body: LoginResponse) =>
	vi.mocked(apiClient.post).mockResolvedValue({ data: body } as AxiosResponse<LoginResponse>);

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

	it("lets a request failure propagate to the caller", async () => {
		const failure = new Error("Network Error");
		vi.mocked(apiClient.post).mockRejectedValue(failure);

		await expect(login(credentials)).rejects.toBe(failure);
	});
});
