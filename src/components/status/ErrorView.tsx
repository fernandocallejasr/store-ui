import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button";

interface ErrorViewProps {
	message: string;
	onRetry?: () => void;
	title?: string;
	retryLabel?: string;
};

const ErrorView = ({
	message,
	onRetry,
	title,
	retryLabel,
}: ErrorViewProps) => (
	<div
		role="alert"
		className="flex min-h-[60vh] items-center justify-center px-4"
	>
		<div className="w-full max-w-md rounded-xl bg-white p-8 text-center dark:bg-slate-700">
			<div className="flex justify-center">
				<FontAwesomeIcon
					icon={faCircleExclamation}
					className="h-8 w-8 text-red-600 dark:text-red-400"
					aria-hidden="true"
				/>
			</div>
			{title && (
				<h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-200">
					{title}
				</h2>
			)}
			<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p>
			{onRetry && (
				<Button className="mt-6" onClick={onRetry}>
					{retryLabel}
				</Button>
			)}
		</div>
	</div>
);

export default ErrorView;
