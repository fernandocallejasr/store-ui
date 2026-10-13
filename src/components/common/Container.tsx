import type { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
	className?: string;
}

const Container = ({ className, children }: ContainerProps) => (
	<div className={["mx-auto w-full max-w-6xl px-4 sm:px-6", className].filter(Boolean).join(" ")}>
		{children}
	</div>
);

export default Container;
