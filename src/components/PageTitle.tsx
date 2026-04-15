interface PageTitleProps {
	title: string;
};

const PageTitle = ( { title }: PageTitleProps ) => {
	return (
		<div className="text-3xl font-primary font-extrabold text-center text-primary mt-4 py-2">
			{ title }
		</div>
	);
};

export default PageTitle;