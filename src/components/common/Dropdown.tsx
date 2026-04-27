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
		<div className="flex items-center gap-2 font-primary">
			<label htmlFor={id} className="text-lg font-semibold text-primary">
				{label}
			</label>
			<select
				id={id}
				className="px-3 py-2 text-base border rounded-md transition border-primary focus:ring"
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
