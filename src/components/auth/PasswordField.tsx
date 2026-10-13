import { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { inputBaseClass, labelClass } from "../common/fieldStyles";

interface PasswordFieldProps {
	name: string;
	label: string;
	autoComplete?: string;
	describedBy?: string;
	invalid?: boolean;
}

const PasswordField = ({
	name,
	label,
	autoComplete = "current-password",
	describedBy,
	invalid = false,
}: PasswordFieldProps) => {
	const [visible, setVisible] = useState(false);
	const id = useId();

	return (
		<div>
			<label htmlFor={id} className={labelClass}>
				{label}
			</label>
			<div className="relative">
				<input
					id={id}
					name={name}
					type={visible ? "text" : "password"}
					autoComplete={autoComplete}
					required
					aria-invalid={invalid || undefined}
					aria-describedby={describedBy}
					className={`${inputBaseClass} py-2.5 pl-3 pr-11`}
				/>
				<button
					type="button"
					onClick={() => setVisible((shown) => !shown)}
					aria-label={visible ? "Hide password" : "Show password"}
					className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:text-slate-400"
				>
					<FontAwesomeIcon icon={visible ? faEyeSlash : faEye} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};

export default PasswordField;
