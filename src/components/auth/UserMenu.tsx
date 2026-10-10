import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/useAuth";

const menuItemClass =
	"w-full flex items-center gap-2 px-4 py-2 text-left text-base font-primary text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

const UserMenu = () => {
	const { session, logOut } = useAuth();
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelId = useId();

	useEffect(() => {
		if (!open)
			return;

		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key !== "Escape")
				return;

			setOpen(false);
			triggerRef.current?.focus();
		};

		const closeOnOutsidePointer = (event: PointerEvent) => {
			if (containerRef.current?.contains(event.target as Node))
				return;

			setOpen(false);
		};

		document.addEventListener("keydown", closeOnEscape);
		document.addEventListener("pointerdown", closeOnOutsidePointer);

		return () => {
			document.removeEventListener("keydown", closeOnEscape);
			document.removeEventListener("pointerdown", closeOnOutsidePointer);
		};
	}, [open]);

	// After every hook, so the hook order stays stable when the session changes.
	if (!session)
		return null;

	return (
		<div className="relative" ref={containerRef}>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((isOpen) => !isOpen)}
				aria-expanded={open}
				aria-controls={panelId}
				className="flex items-center gap-2 text-lg font-primary font-semibold text-primary py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
			>
				{session.user.name}
				<FontAwesomeIcon
					icon={faChevronDown}
					className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
					aria-hidden="true"
				/>
			</button>

			{open && (
				<div
					id={panelId}
					className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 z-30"
				>
					<Link
						to="/profile"
						onClick={() => setOpen(false)}
						className={menuItemClass}
					>
						<FontAwesomeIcon icon={faUser} aria-hidden="true" />
						Profile
					</Link>
					<button
						type="button"
						onClick={() => {
							setOpen(false);
							logOut();
						}}
						className={menuItemClass}
					>
						<FontAwesomeIcon icon={faRightFromBracket} aria-hidden="true" />
						Log out
					</button>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
