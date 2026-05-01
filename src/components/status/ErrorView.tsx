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
		className="flex items-center justify-center min-h-[60vh] px-6"
	>
		<div className="max-w-md w-full text-center bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/40 rounded-2xl shadow-sm p-8">
			<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
				<svg
					aria-hidden="true"
					className="h-6 w-6 text-red-500 dark:text-red-400"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
			</div>
			{title && (
				<h2 className="font-primary font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
					{title}
				</h2>
			)}
			<p className="font-primary text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
			{onRetry && (
				<button
					type="button"
					onClick={onRetry}
					className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-primary font-semibold text-sm text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
				>
					{retryLabel}
				</button>
			)}
		</div>
	</div>
);

export default ErrorView;
