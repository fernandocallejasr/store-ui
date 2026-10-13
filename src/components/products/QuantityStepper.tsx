import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

interface QuantityStepperProps {
	value: number;
	onIncrement: () => void;
	onDecrement: () => void;
	min?: number;
	// Disambiguates the aria-labels when several steppers share a page (e.g. the cart).
	label?: string;
}

const controlClass =
	"inline-flex h-11 w-11 items-center justify-center text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:text-slate-300 dark:hover:bg-slate-800";

const QuantityStepper = ({
	value,
	onIncrement,
	onDecrement,
	min = 1,
	label,
}: QuantityStepperProps) => {
	const suffix = label ? ` of ${label}` : "";

	return (
		<div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-500">
			<button
				type="button"
				onClick={onDecrement}
				disabled={value <= min}
				aria-label={`Decrease quantity${suffix}`}
				className={controlClass}
			>
				<FontAwesomeIcon icon={faMinus} className="h-3 w-3" aria-hidden="true" />
			</button>
			<span
				data-testid="quantity"
				aria-live="polite"
				className="min-w-10 text-center font-mono font-medium tabular-nums text-slate-900 dark:text-slate-100"
			>
				{value}
			</span>
			<button
				type="button"
				onClick={onIncrement}
				aria-label={`Increase quantity${suffix}`}
				className={controlClass}
			>
				<FontAwesomeIcon icon={faPlus} className="h-3 w-3" aria-hidden="true" />
			</button>
		</div>
	);
};

export default QuantityStepper;
