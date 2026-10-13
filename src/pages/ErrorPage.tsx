import { useEffect } from "react";
import {
	Link,
	isRouteErrorResponse,
	useRevalidator,
	useRouteError,
} from "react-router-dom";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { buttonClasses } from "../components/common/buttonStyles";

// Renders a <section>, not a <main>: it sits inside the layout's <main> when a
// child route fails, and inside SiteShell's <main> at the root.
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
		<Container className="py-16 sm:py-24">
			<section aria-labelledby="error-title" className="max-w-xl">
				{isNotFound && (
					<p aria-hidden="true" className="font-mono text-6xl font-medium text-slate-500 dark:text-slate-400">
						404
					</p>
				)}
				<h1 id="error-title" className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
					{title}
				</h1>
				<p className="mt-4 text-pretty text-slate-600 dark:text-slate-400">{message}</p>
				<div className="mt-8 flex flex-wrap items-center gap-6">
					{!isNotFound && (
						<Button onClick={() => revalidate()} disabled={state === "loading"}>
							{state === "loading" ? "Retrying…" : "Try again"}
						</Button>
					)}
					<Link to="/" className={buttonClasses({ variant: "text" })}>
						Back to shop
					</Link>
				</div>
			</section>
		</Container>
	);
};

export default ErrorPage;
