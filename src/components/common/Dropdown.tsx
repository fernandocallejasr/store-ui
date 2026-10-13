import { selectClass } from "./fieldStyles";

export interface DropdownOption {
	label: string;
	value: string;
}

interface DropdownProps {
	id: string;
	label: string;
	options: DropdownOption[];
	selectedValue: string;
	handleSelection: (value: string) => void;
}

const Dropdown = ({
	id,
	label,
	options,
	selectedValue,
	handleSelection,
}: DropdownProps) => {
	return (
		<div className="flex items-center gap-2">
			<label htmlFor={id} className="shrink-0 text-sm font-medium text-slate-700 dark:text-slate-300">
				{label}
			</label>
			<select
				id={id}
				className={`${selectClass} w-full sm:w-auto`}
				value={selectedValue}
				onChange={(e) => handleSelection(e.target.value)}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};

export default Dropdown;
