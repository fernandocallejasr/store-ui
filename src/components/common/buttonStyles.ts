export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "md" | "lg";

interface ButtonStyleOptions {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

// One keyboard-focus treatment for every interactive element. The offset takes
// the page colour in each theme, so the gap never shows up as a white ring.
export const focusRing =
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-800";

const base =
	"inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,border-color,transform] duration-200 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
	primary: "bg-primary text-on-primary hover:bg-primary-hover",
	secondary: "border border-primary text-primary hover:bg-primary/10",
	text: "text-primary underline-offset-4 hover:underline",
};

const textSizes: Record<ButtonSize, string> = {
	md: "text-sm",
	lg: "text-base",
};

// Text buttons sit inline with copy, so they take no padding.
const paddings: Record<ButtonSize, string> = {
	md: "px-4 py-2",
	lg: "px-6 py-3",
};

export const buttonClasses = ({ variant = "primary", size = "md" }: ButtonStyleOptions = {}) =>
	[base, focusRing, variants[variant], textSizes[size], variant === "text" ? "" : paddings[size]]
		.filter(Boolean)
		.join(" ");

// Links inside a sentence stay underlined so colour is not the only cue.
export const inlineLinkClass = `rounded-sm font-medium text-primary underline underline-offset-4 hover:no-underline ${focusRing}`;
