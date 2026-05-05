import { useEffect } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError();
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
			<Link to="/" className="text-primary hover:underline">
				Go back home
			</Link>
		</main>
	);
};

export default ErrorPage;
