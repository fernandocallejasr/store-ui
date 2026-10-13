import {
	Form,
	Link,
	useActionData,
	useNavigate,
	useNavigation,
	useSearchParams,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStore } from "@fortawesome/free-solid-svg-icons";
import PasswordField from "../components/auth/PasswordField";
import AuthHero from "../components/auth/AuthHero";
import Button from "../components/common/Button";
import { inlineLinkClass } from "../components/common/buttonStyles";
import {
	formAlertClass,
	formNoticeClass,
	hintClass,
	inputClass,
	labelClass,
} from "../components/common/fieldStyles";
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
		<div className="grid flex-1 md:grid-cols-2">
			<AuthHero />

			<div className="flex items-center justify-center px-4 py-12 sm:px-6">
				<div className="w-full max-w-sm">
					<FontAwesomeIcon
						icon={faStore}
						className="h-8 w-8 text-primary"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary">Welcome back</h1>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Sign in to your Stickers Shop account.
					</p>

					{justRegistered && (
						<p role="status" className={formNoticeClass}>
							<FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 text-primary" aria-hidden="true" />
							<span>
								Registration successful. Sign in with the email address you
								registered and your password.
							</span>
						</p>
					)}

					{error && (
						<p id={ERROR_ID} role="alert" className={formAlertClass}>
							{error}
						</p>
					)}

					{success && (
						<p role="status" className={formNoticeClass}>
							<FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 text-primary" aria-hidden="true" />
							<span>{success}</span>
						</p>
					)}

					<Form method="post" noValidate className="mt-6 space-y-4">
						<div>
							<label htmlFor="username" className={labelClass}>
								Username
							</label>
							<p id={USERNAME_HINT_ID} className={hintClass}>
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
								className={inputClass}
							/>
						</div>

						<PasswordField
							name="password"
							label="Password"
							invalid={Boolean(error)}
							describedBy={error ? ERROR_ID : undefined}
						/>

						<Button type="submit" size="lg" disabled={submitting} className="w-full">
							{submitting ? "Signing in…" : "Log in"}
						</Button>
					</Form>

					<p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
						Don't have an account?{" "}
						<Link to="/register" className={inlineLinkClass}>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
