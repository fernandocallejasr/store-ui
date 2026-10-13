import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import PasswordField from "../components/auth/PasswordField";
import type { RegisterActionResult } from "./registerAction";

const ERROR_ID = "register-error";

const inputClassName =
	"w-full px-3 py-2.5 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

const labelClassName = "block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300";

const Register = () => {
	const result = useActionData() as RegisterActionResult | undefined;
	const navigation = useNavigation();

	const submitting = navigation.state === "submitting";
	const error = result?.message ?? null;
	const fieldErrors = result?.fieldErrors;

	const fieldMessages = Object.entries(fieldErrors ?? {}).flatMap(([field, messages]) =>
		messages.map((message) => ({ field, message })),
	);

	// With per-field detail, mark only the fields the backend named. Without it
	// the failure belongs to the form as a whole, so every field is suspect.
	const invalid = (field: string) =>
		(fieldErrors ? fieldErrors[field] !== undefined : Boolean(error)) || undefined;

	const describedBy = error ? ERROR_ID : undefined;

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
					<h1 className="mt-6 text-3xl font-semibold text-primary">Create an account</h1>
					<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Join the Stickers Shop in a few seconds.
					</p>

					{error && (
						<div
							id={ERROR_ID}
							role="alert"
							className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
						>
							<p>{error}</p>
							{fieldMessages.length > 0 && (
								<ul className="mt-2 list-disc space-y-1 pl-5">
									{fieldMessages.map(({ field, message }) => (
										<li key={`${field}:${message}`}>{message}</li>
									))}
								</ul>
							)}
						</div>
					)}

					<Form method="post" noValidate className="mt-6 space-y-4">
						<div>
							<label htmlFor="name" className={labelClassName}>
								Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								autoComplete="name"
								required
								aria-invalid={invalid("name")}
								aria-describedby={describedBy}
								className={inputClassName}
							/>
						</div>

						<div>
							<label htmlFor="mobileNumber" className={labelClassName}>
								Mobile number
							</label>
							<input
								id="mobileNumber"
								name="mobileNumber"
								type="tel"
								inputMode="numeric"
								autoComplete="tel-national"
								required
								aria-invalid={invalid("mobileNumber")}
								aria-describedby={describedBy}
								className={inputClassName}
							/>
						</div>

						<div>
							<label htmlFor="email" className={labelClassName}>
								Email
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								aria-invalid={invalid("email")}
								aria-describedby={describedBy}
								className={inputClassName}
							/>
						</div>

						<PasswordField
							name="password"
							label="Password"
							autoComplete="new-password"
							invalid={Boolean(invalid("password"))}
							describedBy={describedBy}
						/>

						<PasswordField
							name="confirmPassword"
							label="Confirm password"
							autoComplete="new-password"
							invalid={Boolean(invalid("password"))}
							describedBy={describedBy}
						/>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-full bg-primary py-3 text-base font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
						>
							{submitting ? "Creating account…" : "Create account"}
						</button>
					</Form>

					<p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-semibold text-primary underline hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
