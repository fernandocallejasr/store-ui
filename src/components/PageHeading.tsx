import type { PropsWithChildren, ReactNode } from "react";
import PageTitle from "./PageTitle";

interface PageHeadingProps extends PropsWithChildren {
	title: string;
	// A short supporting fact shown beside the title, such as "3 items".
	meta?: ReactNode;
};

const PageHeading = ({ title, meta, children }: PageHeadingProps) => (
	<div className="pb-8 pt-10 sm:pt-14">
		<div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
			<PageTitle title={title} />
			{meta && (
				<p className="text-sm text-slate-600 dark:text-slate-400">{meta}</p>
			)}
		</div>
		{children && (
			<div className="mt-3 max-w-[65ch] text-pretty text-slate-600 dark:text-slate-400">
				{children}
			</div>
		)}
	</div>
);

export default PageHeading;
