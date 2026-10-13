interface LoadingViewProps {
	message?: string;
};

// Under reduced motion the ring holds still and the message carries the state.
const LoadingView = ({ message }: LoadingViewProps) => (
	<div
		role="status"
		aria-live="polite"
		className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
	>
		<div
			aria-hidden="true"
			className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-primary motion-safe:animate-spin dark:border-slate-800 dark:border-t-primary"
		/>
		<span className="text-sm text-slate-600 dark:text-slate-400">{message}</span>
	</div>
);

export default LoadingView;
