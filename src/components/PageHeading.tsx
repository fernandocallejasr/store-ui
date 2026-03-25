import type { PropsWithChildren } from "react";
import PageTitle from "./PageTitle";

interface PageHeadingProps extends PropsWithChildren {
	title: string;
};

const PageHeading = ({ title, children }: PageHeadingProps) => {
	return (
		<div className="page-heading-container">
			<PageTitle title={title}/>
			{ children }
		</div>
	);
};

export default PageHeading;