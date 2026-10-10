import type { AxiosResponse } from "axios";
import apiClient from "../api/apiClient";
import { getProfile } from "./profileRepository";
import type { User } from "../components/auth/types";

vi.mock("../api/apiClient", () => ({
	default: { get: vi.fn() },
}));

const profile: User = {
	userId: 7,
	name: "My User",
	email: "myuser@example.com",
	mobileNumber: "5550000000",
};

const resolveWith = (body: unknown) =>
	vi.mocked(apiClient.get).mockResolvedValue({ data: body } as AxiosResponse<unknown>);

const SPA_FALLBACK_HTML =
	'<!doctype html><html><head><title>Vite App</title></head><body><div id="root"></div></body></html>';

describe("profileRepository.getProfile", () => {
	beforeEach(() => {
		vi.mocked(apiClient.get).mockReset();
	});

	it("gets the profile endpoint with the abort signal", async () => {
		resolveWith(profile);
		const controller = new AbortController();

		await getProfile(controller.signal);

		expect(apiClient.get).toHaveBeenCalledWith("/profile", { signal: controller.signal });
	});

	it("returns the response body unchanged", async () => {
		resolveWith(profile);

		await expect(getProfile()).resolves.toEqual(profile);
	});

	it.each([
		["the SPA fallback page", SPA_FALLBACK_HTML],
		["null", null],
		["an array", [profile]],
		["a profile with no name", { ...profile, name: undefined }],
		["a profile with no email", { ...profile, email: undefined }],
		["a string userId", { ...profile, userId: "7" }],
		["a null mobile number", { ...profile, mobileNumber: null }],
	])("rejects a 2xx carrying %s instead of showing it", async (_label, body) => {
		resolveWith(body);

		await expect(getProfile()).rejects.toThrow(/not a profile/);
	});

	it("lets a request failure propagate to the caller", async () => {
		const failure = new Error("Network Error");
		vi.mocked(apiClient.get).mockRejectedValue(failure);

		await expect(getProfile()).rejects.toBe(failure);
	});
});
