import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import PasswordField from "../components/auth/PasswordField";
import AuthHero from "../components/auth/AuthHero";
import Button from "../components/common/Button";
import { inlineLinkClass } from "../components/common/buttonStyles";
import { formAlertClass, inputClass, labelClass } from "../components/common/fieldStyles";
import type { RegisterActionResult } from "./registerAction";

const ERROR_ID = "register-error";

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
		<div className="grid flex-1 md:grid-cols-2">
			<AuthHero />

			<div className="flex items-center justify-center px-4 py-12 sm:px-6">
				<div className="w-full max-w-sm">
					<FontAwesomeIcon
						icon={faStore}
						className="h-8 w-8 text-primary"
						aria-hidden="true"
					/>
					<h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary">Create an account</h1>
					<p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
						Join the Stickers Shop in a few seconds.
					</p>

					{error && (
						<div id={ERROR_ID} role="alert" className={formAlertClass}>
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
							<label htmlFor="name" className={labelClass}>
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
								className={inputClass}
							/>
						</div>

						<div>
							<label htmlFor="mobileNumber" className={labelClass}>
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
								className={inputClass}
							/>
						</div>

						<div>
							<label htmlFor="email" className={labelClass}>
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
								className={inputClass}
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

						<Button type="submit" size="lg" disabled={submitting} className="w-full">
							{submitting ? "Creating account…" : "Create account"}
						</Button>
					</Form>

					<p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
						Already have an account?{" "}
						<Link to="/login" className={inlineLinkClass}>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
