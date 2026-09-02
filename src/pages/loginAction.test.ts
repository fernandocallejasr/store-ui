import { AxiosError, type AxiosResponse } from "axios";
import { loginAction } from "./loginAction";
import { login } from "../repositories/authRepository";
import type { LoginResponse } from "../components/auth/types";

vi.mock("../repositories/authRepository", () => ({
	login: vi.fn(),
}));

const CREDENTIALS_ERROR = "Incorrect username or password.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const EMPTY_FIELDS_ERROR = "Enter your username and password.";

const loginResponse: LoginResponse = {
	message: "Correctly logged in",
	user: null,
	jwtToken: null,
};

const callAction = (fields: Record<string, string>) => {
	const body = new FormData();
	Object.entries(fields).forEach(([key, value]) => body.append(key, value));

	return loginAction({
		request: new Request("http://localhost/login", { method: "POST", body }),
	});
};

const axiosErrorWithStatus = (status: number): AxiosError => {
	const error = new AxiosError("Request failed");
	error.response = { status } as AxiosResponse;
	return error;
};

describe("loginAction", () => {
	beforeEach(() => {
		vi.mocked(login).mockReset();
	});

	it("sends the trimmed username and the verbatim password to the repository", async () => {
		vi.mocked(login).mockResolvedValue(loginResponse);

		await callAction({ username: "  myuser  ", password: "  secret  " });

		expect(login).toHaveBeenCalledWith(
			{ username: "myuser", password: "  secret  " },
			expect.any(AbortSignal),
		);
	});

	it("returns the response, including user and token, on success", async () => {
		const populated: LoginResponse = {
			message: "Correctly logged in",
			user: {
				userId: 1,
				name: "MyUser",
				email: "myuser@example.com",
				mobileNumber: "5550000",
			},
			jwtToken: "a.b.c",
		};
		vi.mocked(login).mockResolvedValue(populated);

		await expect(callAction({ username: "myuser", password: "secret" })).resolves.toEqual({
			status: "success",
			response: populated,
		});
	});

	it.each([
		["an unknown username (404)", 404],
		["rejected credentials (401)", 401],
	])("reports %s with the same non-revealing message", async (_label, status) => {
		vi.mocked(login).mockRejectedValue(axiosErrorWithStatus(status));

		await expect(callAction({ username: "ghost", password: "secret" })).resolves.toEqual({
			status: "error",
			message: CREDENTIALS_ERROR,
		});
	});

	it("reports a server error with the generic message", async () => {
		vi.mocked(login).mockRejectedValue(axiosErrorWithStatus(500));

		await expect(callAction({ username: "myuser", password: "secret" })).resolves.toEqual({
			status: "error",
			message: GENERIC_ERROR,
		});
	});

	it("reports a network failure with the generic message", async () => {
		vi.mocked(login).mockRejectedValue(new Error("Network Error"));

		await expect(callAction({ username: "myuser", password: "secret" })).resolves.toEqual({
			status: "error",
			message: GENERIC_ERROR,
		});
	});

	it.each([
		["a blank username", { username: "   ", password: "secret" }],
		["a missing password", { username: "myuser", password: "" }],
	])("rejects %s without calling the repository", async (_label, fields) => {
		await expect(callAction(fields)).resolves.toEqual({
			status: "error",
			message: EMPTY_FIELDS_ERROR,
		});
		expect(login).not.toHaveBeenCalled();
	});
});
