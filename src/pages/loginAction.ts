import axios from "axios";
import type { ActionFunctionArgs } from "react-router-dom";
import { login } from "../repositories/authRepository";
import type { LoginResponse } from "../components/auth/types";

export type LoginActionResult =
	| { status: "error"; message: string }
	| { status: "success"; response: LoginResponse };

export type LoginActionArgs = Pick<ActionFunctionArgs, "request">;

const CREDENTIALS_ERROR = "Incorrect username or password.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const EMPTY_FIELDS_ERROR = "Enter your username and password.";

const messageForError = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		const status = error.response?.status;
		if (status === 401 || status === 404) return CREDENTIALS_ERROR;
	}

	return GENERIC_ERROR;
};

export const loginAction = async ({ request }: LoginActionArgs): Promise<LoginActionResult> => {
	const formData = await request.formData();
	const username = String(formData.get("username") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!username || !password)
		return { status: "error", message: EMPTY_FIELDS_ERROR };

	try {
		const response = await login({ username, password }, request.signal);
		return { status: "success", response };
	} catch (error) {
		return { status: "error", message: messageForError(error) };
	}
};
