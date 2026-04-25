interface LoadingViewProps {
	message?: string;
};

const LoadingView = ({ message }: LoadingViewProps) => (
	<div
		role="status"
		aria-live="polite"
		className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
	>
		<div
			aria-hidden="true"
			className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-primary animate-spin"
		/>
		<span className="font-primary text-base text-gray-600">{message}</span>
	</div>
);

export default LoadingView;
