import type { ButtonHTMLAttributes } from "react";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const Button = ({ variant, size, className, type = "button", ...rest }: ButtonProps) => (
	<button
		type={type}
		className={[buttonClasses({ variant, size }), className].filter(Boolean).join(" ")}
		{...rest}
	/>
);

export default Button;
