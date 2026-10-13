interface PageTitleProps {
	title: string;
};

const PageTitle = ({ title }: PageTitleProps) => (
	<h1 className="text-3xl font-semibold tracking-tight text-balance text-primary sm:text-4xl">
		{title}
	</h1>
);

export default PageTitle;
