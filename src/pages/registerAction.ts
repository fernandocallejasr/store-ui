import axios from "axios";
import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { register } from "../repositories/authRepository";

export const REGISTERED_QUERY_PARAM = "registered";

export type RegisterActionResult = {
	status: "error";
	message: string;
	fieldErrors?: Record<string, string[]>;
};

export type RegisterActionArgs = Pick<ActionFunctionArgs, "request">;

const GENERIC_ERROR = "Something went wrong. Please try again.";
const EMPTY_FIELDS_ERROR = "Fill in every field.";
const PASSWORD_MISMATCH_ERROR = "The passwords do not match.";

const LOGIN_REDIRECT_PATH = `/login?${REGISTERED_QUERY_PARAM}=1`;

// A failure arrives as an RFC 9457 ProblemDetail, but only these two statuses
// carry anything worth repeating to the visitor: 400 names the fields bean
// validation rejected, 409 says the email is taken. A 500 or a timeout tells
// them nothing they can act on, so it becomes the generic message.
const REPORTED_STATUSES = [400, 409];

const problemDetailOf = (error: unknown): Record<string, unknown> | null => {
	if (!axios.isAxiosError(error))
		return null;

	const status = error.response?.status;
	if (!status || !REPORTED_STATUSES.includes(status))
		return null;

	const data = error.response?.data;
	if (typeof data !== "object" || data === null || Array.isArray(data))
		return null;

	return data as Record<string, unknown>;
};

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((entry) => typeof entry === "string");

const fieldErrorsOf = (problem: Record<string, unknown>): Record<string, string[]> | undefined => {
	const { errors } = problem;

	if (typeof errors !== "object" || errors === null || Array.isArray(errors))
		return undefined;

	const entries = Object.entries(errors);
	if (entries.length === 0 || !entries.every(([, messages]) => isStringArray(messages)))
		return undefined;

	return errors as Record<string, string[]>;
};

const resultForError = (error: unknown): RegisterActionResult => {
	const problem = problemDetailOf(error);

	if (!problem || typeof problem.detail !== "string" || !problem.detail)
		return { status: "error", message: GENERIC_ERROR };

	const fieldErrors = fieldErrorsOf(problem);

	return fieldErrors
		? { status: "error", message: problem.detail, fieldErrors }
		: { status: "error", message: problem.detail };
};

export const registerAction = async ({
	request,
}: RegisterActionArgs): Promise<RegisterActionResult | Response> => {
	const formData = await request.formData();

	const name = String(formData.get("name") ?? "").trim();
	const mobileNumber = String(formData.get("mobileNumber") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const confirmPassword = String(formData.get("confirmPassword") ?? "");

	if (!name || !mobileNumber || !email || !password || !confirmPassword)
		return { status: "error", message: EMPTY_FIELDS_ERROR };

	if (password !== confirmPassword)
		return { status: "error", message: PASSWORD_MISMATCH_ERROR };

	try {
		await register({ name, email, mobileNumber, password }, request.signal);

		return redirect(LOGIN_REDIRECT_PATH);
	} catch (error) {
		return resultForError(error);
	}
};
