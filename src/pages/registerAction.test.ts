import { AxiosError, type AxiosResponse } from "axios";
import { registerAction, REGISTERED_QUERY_PARAM } from "./registerAction";
import { register } from "../repositories/authRepository";

vi.mock("../repositories/authRepository", () => ({
	register: vi.fn(),
}));

const GENERIC_ERROR = "Something went wrong. Please try again.";
const EMPTY_FIELDS_ERROR = "Fill in every field.";
const PASSWORD_MISMATCH_ERROR = "The passwords do not match.";

const validFields = {
	name: "My User",
	mobileNumber: "5550000000",
	email: "myuser@example.com",
	password: "supersecret",
	confirmPassword: "supersecret",
};

const callAction = (fields: Record<string, string>) => {
	const body = new FormData();
	Object.entries(fields).forEach(([key, value]) => body.append(key, value));

	return registerAction({
		request: new Request("http://localhost/register", { method: "POST", body }),
	});
};

// The backend answers a failure with an RFC 9457 ProblemDetail; a 400 from bean
// validation carries the per-field messages under "errors".
const axiosErrorWithBody = (status: number, data?: unknown): AxiosError => {
	const error = new AxiosError("Request failed");
	error.response = { status, data } as AxiosResponse;
	return error;
};

describe("registerAction", () => {
	beforeEach(() => {
		vi.mocked(register).mockReset().mockResolvedValue(undefined);
	});

	it("sends the trimmed fields and the verbatim password to the repository", async () => {
		await callAction({
			...validFields,
			name: "  My User  ",
			mobileNumber: "  5550000000  ",
			email: "  myuser@example.com  ",
			password: "  supersecret  ",
			confirmPassword: "  supersecret  ",
		});

		expect(register).toHaveBeenCalledWith(
			{
				name: "My User",
				mobileNumber: "5550000000",
				email: "myuser@example.com",
				password: "  supersecret  ",
			},
			expect.any(AbortSignal),
		);
	});

	it("does not forward the confirmation field the backend has no use for", async () => {
		await callAction(validFields);

		expect(vi.mocked(register).mock.calls[0][0]).not.toHaveProperty("confirmPassword");
	});

	it("sends the visitor to the login page on success", async () => {
		const result = await callAction(validFields);

		expect(result).toBeInstanceOf(Response);
		const redirect = result as Response;
		expect(redirect.status).toBe(302);
		expect(redirect.headers.get("Location")).toBe(`/login?${REGISTERED_QUERY_PARAM}=1`);
	});

	it.each([
		["a blank name", { name: "   " }],
		["a blank mobile number", { mobileNumber: "   " }],
		["a blank email", { email: "   " }],
		["a missing password", { password: "" }],
		["a missing confirmation", { confirmPassword: "" }],
	])("rejects %s without calling the repository", async (_label, override) => {
		await expect(callAction({ ...validFields, ...override })).resolves.toEqual({
			status: "error",
			message: EMPTY_FIELDS_ERROR,
		});
		expect(register).not.toHaveBeenCalled();
	});

	it("rejects mismatched passwords without calling the repository", async () => {
		await expect(
			callAction({ ...validFields, confirmPassword: "notmatchingpassword" }),
		).resolves.toEqual({
			status: "error",
			message: PASSWORD_MISMATCH_ERROR,
		});
		expect(register).not.toHaveBeenCalled();
	});

	it("reports the backend's per-field validation messages on a 400", async () => {
		vi.mocked(register).mockRejectedValue(
			axiosErrorWithBody(400, {
				status: 400,
				detail: "Request validation failed",
				errors: {
					mobileNumber: ["Mobile number must be exactly 10 digits"],
					password: ["Password length must be between 8 and 20 characters"],
				},
			}),
		);

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: "Request validation failed",
			fieldErrors: {
				mobileNumber: ["Mobile number must be exactly 10 digits"],
				password: ["Password length must be between 8 and 20 characters"],
			},
		});
	});

	it("reports the backend's message when a 400 carries no field errors", async () => {
		vi.mocked(register).mockRejectedValue(
			axiosErrorWithBody(400, { status: 400, detail: "Invalid request content." }),
		);

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: "Invalid request content.",
		});
	});

	it("reports the backend's message when the email is already registered", async () => {
		vi.mocked(register).mockRejectedValue(
			axiosErrorWithBody(409, {
				status: 409,
				detail: "An account with that email already exists.",
			}),
		);

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: "An account with that email already exists.",
		});
	});

	// A ProblemDetail is only as trustworthy as the thing that sent it: a proxy
	// error page or an SPA fallback can occupy the same slot.
	it.each([
		["a body that is not an object", "Bad Request"],
		["a null body", null],
		["a body with no detail", { status: 400 }],
		["a non-string detail", { status: 400, detail: 42 }],
	])("falls back to the generic message given %s", async (_label, data) => {
		vi.mocked(register).mockRejectedValue(axiosErrorWithBody(400, data));

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: GENERIC_ERROR,
		});
	});

	it.each([
		["errors that is not an object", { status: 400, detail: "Nope", errors: "boom" }],
		["errors whose values are not arrays", { status: 400, detail: "Nope", errors: { name: "boom" } }],
		[
			"errors whose arrays hold non-strings",
			{ status: 400, detail: "Nope", errors: { name: [42] } },
		],
	])("keeps the message but drops %s", async (_label, data) => {
		vi.mocked(register).mockRejectedValue(axiosErrorWithBody(400, data));

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: "Nope",
		});
	});

	it("reports a server error with the generic message", async () => {
		vi.mocked(register).mockRejectedValue(
			axiosErrorWithBody(500, { status: 500, detail: "An unexpected error occurred" }),
		);

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: GENERIC_ERROR,
		});
	});

	it("reports a network failure with the generic message", async () => {
		vi.mocked(register).mockRejectedValue(new Error("Network Error"));

		await expect(callAction(validFields)).resolves.toEqual({
			status: "error",
			message: GENERIC_ERROR,
		});
	});
});
