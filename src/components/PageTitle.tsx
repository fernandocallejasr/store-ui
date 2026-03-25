interface PageTitleProps {
	title: string;
};

const PageTitle = ( { title }: PageTitleProps ) => {
	return (
		<div className="page-title">
			{ title }
		</div>
	);
};

export default PageTitle;