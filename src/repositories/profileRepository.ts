import apiClient from "../api/apiClient";
import type { User } from "../components/auth/types";

const PROFILE_URL_PATH = "/profile";

const isProfile = (value: unknown): value is User => {
	if (typeof value !== "object" || value === null || Array.isArray(value))
		return false;

	const { userId, name, email, mobileNumber } = value as Partial<User>;

	return typeof userId === "number" &&
		typeof name === "string" &&
		typeof email === "string" &&
		typeof mobileNumber === "string";
};

export const getProfile = async (signal?: AbortSignal): Promise<User> => {
	const { data } = await apiClient.get<unknown>(PROFILE_URL_PATH, { signal });

	if (!isProfile(data))
		throw new Error("Profile request failed: the response body was not a profile");

	return data;
};
