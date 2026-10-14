import type { Ref } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { inputBaseClass } from "./fieldStyles";

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	ariaLabel?: string;
	ref?: Ref<HTMLInputElement>;
}

// Fills its parent; the caller decides how wide that is.
const SearchBox = ({
	value,
	onChange,
	placeholder = "Search…",
	ariaLabel = "Search",
	ref,
}: SearchBoxProps) => {
	return (
		<div className="relative w-full">
			<FontAwesomeIcon
				icon={faMagnifyingGlass}
				aria-hidden="true"
				className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
			/>
			<input
				ref={ref}
				type="search"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={ariaLabel}
				className={`${inputBaseClass} py-2 pl-9 pr-3`}
			/>
		</div>
	);
};

export default SearchBox;
