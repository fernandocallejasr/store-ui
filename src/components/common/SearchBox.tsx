interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	ariaLabel?: string;
}

const SearchBox = ({
	value,
	onChange,
	placeholder = "Search…",
	ariaLabel = "Search",
}: SearchBoxProps) => {
	return (
		<div className="relative w-xs">
			<span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-5 h-5"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="7" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			</span>
			<input
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={ariaLabel}
				className="w-full pl-10 pr-3 py-2 font-primary text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
			/>
		</div>
	);
};

export default SearchBox;
