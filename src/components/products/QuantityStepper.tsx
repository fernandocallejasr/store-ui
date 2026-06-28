interface QuantityStepperProps {
	value: number;
	onIncrement: () => void;
	onDecrement: () => void;
	min?: number;
	// Disambiguates the aria-labels when several steppers share a page (e.g. the cart).
	label?: string;
}

const QuantityStepper = ({
	value,
	onIncrement,
	onDecrement,
	min = 1,
	label,
}: QuantityStepperProps) => {
	const suffix = label ? ` of ${label}` : "";
	const controlClass =
		"px-3 py-2 text-lg text-primary hover:bg-lighter dark:hover:bg-gray-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset";

	return (
		<div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
			<button
				type="button"
				onClick={onDecrement}
				disabled={value <= min}
				aria-label={`Decrease quantity${suffix}`}
				className={`${controlClass} disabled:opacity-40 disabled:cursor-not-allowed`}
			>
				−
			</button>
			<span
				data-testid="quantity"
				aria-live="polite"
				className="px-4 py-2 min-w-12 text-center font-medium text-primary"
			>
				{value}
			</span>
			<button
				type="button"
				onClick={onIncrement}
				aria-label={`Increase quantity${suffix}`}
				className={controlClass}
			>
				+
			</button>
		</div>
	);
};

export default QuantityStepper;
