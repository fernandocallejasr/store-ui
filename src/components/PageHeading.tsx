import type { PropsWithChildren } from "react";
import PageTitle from "./PageTitle";

interface PageHeadingProps extends PropsWithChildren {
	title: string;
};

const PageHeading = ({ title, children }: PageHeadingProps) => {
	return (
		<div className="text-center max-w-xl mx-auto px-4 py-6">
			<PageTitle title={title}/>
			{ children }
		</div>
	);
};

export default PageHeading;