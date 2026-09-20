import {
	Form,
	Link,
	useActionData,
	useNavigate,
	useNavigation,
	useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import PasswordField from "../components/auth/PasswordField";
import type { LoginActionResult } from "./loginAction";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { HOME_PATH, REDIRECT_PATH_STORAGE_KEY } from "../components/auth/ProtectedRoute";
import { safeSessionStorage } from "../lib/safeStorage";
import { REGISTERED_QUERY_PARAM } from "./registerAction";

const ERROR_ID = "login-error";
const USERNAME_HINT_ID = "login-username-hint";

const Login = () => {
	const result = useActionData() as LoginActionResult | undefined;
	const navigation = useNavigation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { loginSuccess } = useAuth();

	const submitting = navigation.state === "submitting";
	const error = result?.status === "error" ? result.message : null;
	const success = result?.status === "success" ? result.response.message : null;

	const justRegistered = searchParams.has(REGISTERED_QUERY_PARAM) && !result;

	useEffect(() => {
		if (result?.status !== "success")
			return

		const { jwtToken, user } = result.response;
		if (!jwtToken || !user)
			return

		loginSuccess(jwtToken, user);

		const originPagePath = safeSessionStorage.read(REDIRECT_PATH_STORAGE_KEY) || HOME_PATH;
		safeSessionStorage.clear(REDIRECT_PATH_STORAGE_KEY);

		navigate(originPagePath, { replace: true });
	}, [ result, loginSuccess, navigate ]);

	return (
		<div className="grid md:grid-cols-2 flex-1 font-primary">
			<div
				aria-hidden="true"
				className="relative hidden md:block bg-gray-900 bg-[url('/login-hero.jpg')] bg-cover bg-center"
			>
				<div className="absolute inset-0 bg-black/50 backdrop-saturate-50" />
			</div>

			<div className="flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-sm">
					<FontAwesomeIcon
						icon={faStore}
						className="h-9 w-9 text-primary"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold text-primary">Welcome back</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Sign in to your Stickers Shop account.
					</p>

					{justRegistered && (
						<p
							role="status"
							className="mt-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
						>
							Registration successful. Sign in with the email address you
							registered and your password.
						</p>
					)}

					{error && (
						<p
							id={ERROR_ID}
							role="alert"
							className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
						>
							{error}
						</p>
					)}

					{success && (
						<p
							role="status"
							className="mt-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
						>
							{success}
						</p>
					)}

					<Form method="post" noValidate className="mt-6 space-y-4">
						<div>
							<label
								htmlFor="username"
								className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								Username
							</label>
							<p
								id={USERNAME_HINT_ID}
								className="mb-1 text-xs text-gray-500 dark:text-gray-400"
							>
								Your email address
							</p>
							<input
								id="username"
								name="username"
								type="text"
								autoComplete="username"
								required
								aria-invalid={Boolean(error) || undefined}
								aria-describedby={
									error ? `${USERNAME_HINT_ID} ${ERROR_ID}` : USERNAME_HINT_ID
								}
								className="w-full px-3 py-2.5 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
						</div>

						<PasswordField
							name="password"
							label="Password"
							invalid={Boolean(error)}
							describedBy={error ? ERROR_ID : undefined}
						/>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-primary py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							{submitting ? "Signing in…" : "Log in"}
						</button>
					</Form>

					<p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
						Don't have an account?{" "}
						<Link
							to="/register"
							className="font-semibold text-primary underline hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
						>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
