import { useId, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
			<label
				htmlFor={id}
				className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
			>
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
					className="w-full pl-3 pr-11 py-2.5 text-base border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
				/>
				<button
					type="button"
					onClick={() => setVisible((shown) => !shown)}
					aria-label={visible ? "Hide password" : "Show password"}
					className="absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
				>
					<FontAwesomeIcon icon={visible ? faEyeSlash : faEye} aria-hidden="true" />
				</button>
			</div>
		</div>
	);
};

export default PasswordField;
