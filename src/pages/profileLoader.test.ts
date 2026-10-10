import { AxiosError, type AxiosResponse } from "axios";
import { profileLoader } from "./profileLoader";
import { getProfile } from "../repositories/profileRepository";
import { SESSION_STORAGE_KEY } from "../context/authContextValue";
import { onSessionEnded } from "../context/sessionEvents";
import { REDIRECT_PATH_STORAGE_KEY } from "../components/auth/ProtectedRoute";
import type { Session, User } from "../components/auth/types";

vi.mock("../repositories/profileRepository", () => ({
	getProfile: vi.fn(),
}));

const testSession: Session = { jwtToken: "a.b.c", user: { userId: 7, name: "My User" } };

const profile: User = {
	userId: 7,
	name: "Renamed User",
	email: "myuser@example.com",
	mobileNumber: "5550000000",
};

const signIn = () =>
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(testSession));

const axiosErrorWithStatus = (status: number): AxiosError => {
	const error = new AxiosError("Request failed");
	error.response = { status } as AxiosResponse;
	return error;
};

const callLoader = () =>
	profileLoader({ request: new Request("http://localhost/profile") });

// Response.status is a prototype getter, so toMatchObject can't see it —
// catch the throw and assert on the instance directly.
const catchThrown = async (): Promise<unknown> => {
	try {
		await callLoader();
	} catch (error) {
		return error;
	}
	throw new Error("loader resolved but should have thrown");
};

const expectRedirectToLogin = (thrown: unknown) => {
	expect(thrown).toBeInstanceOf(Response);
	expect((thrown as Response).status).toBe(302);
	expect((thrown as Response).headers.get("Location")).toBe("/login");
	expect(sessionStorage.getItem(REDIRECT_PATH_STORAGE_KEY)).toBe("/profile");
};

describe("profileLoader", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.mocked(getProfile).mockReset();
	});

	it("returns the profile from the endpoint", async () => {
		signIn();
		vi.mocked(getProfile).mockResolvedValue(profile);

		await expect(callLoader()).resolves.toEqual(profile);
		expect(getProfile).toHaveBeenCalledWith(expect.any(AbortSignal));
	});

	it("ends the session and redirects to login without calling the endpoint when nobody is signed in", async () => {
		const sessionEnded = vi.fn();
		const unsubscribe = onSessionEnded(sessionEnded);

		const thrown = await catchThrown();
		unsubscribe();

		expectRedirectToLogin(thrown);
		expect(sessionEnded).toHaveBeenCalledOnce();
		expect(getProfile).not.toHaveBeenCalled();
	});

	it("treats a stored session that is not valid as signed out", async () => {
		localStorage.setItem(
			SESSION_STORAGE_KEY,
			JSON.stringify({ jwtToken: "not-a-jwt", user: { userId: 7, name: "My User" } }),
		);

		const thrown = await catchThrown();

		expectRedirectToLogin(thrown);
		expect(getProfile).not.toHaveBeenCalled();
	});

	it.each([
		["401, an expired or invalid token", 401],
		["404, an account deleted since login", 404],
	])("ends the session and redirects to login on %s", async (_label, status) => {
		signIn();
		vi.mocked(getProfile).mockRejectedValue(axiosErrorWithStatus(status));
		const sessionEnded = vi.fn();
		const unsubscribe = onSessionEnded(sessionEnded);

		const thrown = await catchThrown();
		unsubscribe();

		expectRedirectToLogin(thrown);
		expect(sessionEnded).toHaveBeenCalledOnce();
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
	});

	it.each([
		["a 500", axiosErrorWithStatus(500)],
		["a 403", axiosErrorWithStatus(403)],
		["a network failure", new AxiosError("Network Error")],
		["a body that is not a profile", new Error("the response body was not a profile")],
	])("rethrows %s for the error page and keeps the session", async (_label, failure) => {
		signIn();
		vi.mocked(getProfile).mockRejectedValue(failure);

		const thrown = await catchThrown();

		expect(thrown).toBe(failure);
		expect(localStorage.getItem(SESSION_STORAGE_KEY)).not.toBeNull();
	});
});
