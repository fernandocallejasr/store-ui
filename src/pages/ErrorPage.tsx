import { useEffect } from "react";
import {
	Link,
	isRouteErrorResponse,
	useRevalidator,
	useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError();
	const { revalidate, state } = useRevalidator();
	const isNotFound = isRouteErrorResponse(error) && error.status === 404;

	useEffect(() => {
		console.error("Route error:", error);
	}, [error]);

	const title = isNotFound ? "Page not found" : "Something went wrong";
	const message = isNotFound
		? "The page you're looking for doesn't exist or has been moved."
		: "An unexpected error occurred. Please try again later.";

	return (
		<main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
			<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
				{title}
			</h1>
			<p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
			{!isNotFound && (
				<button
					type="button"
					onClick={() => revalidate()}
					disabled={state === "loading"}
					className="mb-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 font-primary font-semibold text-sm text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-gray-800"
				>
					{state === "loading" ? "Retrying…" : "Try again"}
				</button>
			)}
			<Link to="/" className="text-primary hover:underline">
				Go back home
			</Link>
		</main>
	);
};

export default ErrorPage;
