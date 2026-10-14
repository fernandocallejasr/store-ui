import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/useAuth";
import Container from "../common/Container";
import ThemeToggle from "../common/ThemeToggle";
import { focusRing } from "../common/buttonStyles";

const itemBase = `flex min-h-11 w-full items-center rounded-lg px-3 text-left text-base font-medium transition-colors ${focusRing}`;
const idleItem = "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700";

const linkClass = ({ isActive }: { isActive: boolean }) =>
	`${itemBase} ${isActive ? "text-primary" : idleItem}`;

// Rendered only while open: tests run without CSS, so an always-mounted panel
// would duplicate every header link.
const MobileMenu = () => {
	const { session, logOut } = useAuth();
	const location = useLocation();
	const [open, setOpen] = useState(false);
	const [seenLocationKey, setSeenLocationKey] = useState(location.key);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelId = useId();

	// Any navigation closes the menu, including back/forward and links outside it.
	// React's "adjust state while rendering" pattern; an effect would first paint
	// the stale open panel for a frame.
	if (location.key !== seenLocationKey) {
		setSeenLocationKey(location.key);
		setOpen(false);
	}

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

	const close = () => setOpen(false);

	return (
		<div ref={containerRef} className="md:hidden">
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((isOpen) => !isOpen)}
				aria-expanded={open}
				aria-controls={panelId}
				aria-label="Menu"
				className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 ${focusRing}`}
			>
				<FontAwesomeIcon icon={open ? faXmark : faBars} className="h-5 w-5" aria-hidden="true" />
			</button>

			{open && (
				<div
					id={panelId}
					className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-slate-200 bg-slate-50 shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800"
				>
					<Container className="flex flex-col gap-4 py-4">
						<nav aria-label="Mobile">
							<ul className="flex flex-col gap-1">
								<li>
									<NavLink to="/" end onClick={close} className={linkClass}>
										Shop
									</NavLink>
								</li>
								<li>
									<NavLink to="/contact" onClick={close} className={linkClass}>
										Contact
									</NavLink>
								</li>
							</ul>
						</nav>

						<div className="border-t border-slate-200 pt-4 dark:border-slate-700">
							{session ? (
								<>
									<p className="px-3 text-sm text-slate-600 dark:text-slate-400">
										Signed in as {session.user.name}
									</p>
									<ul className="mt-2 flex flex-col gap-1">
										<li>
											<NavLink to="/profile" onClick={close} className={linkClass}>
												Profile
											</NavLink>
										</li>
										<li>
											<button
												type="button"
												onClick={() => {
													close();
													logOut();
												}}
												className={`${itemBase} ${idleItem}`}
											>
												Log out
											</button>
										</li>
									</ul>
								</>
							) : (
								<ul className="flex flex-col gap-1">
									<li>
										<NavLink to="/login" onClick={close} className={linkClass}>
											Log in
										</NavLink>
									</li>
									<li>
										<NavLink to="/register" onClick={close} className={linkClass}>
											Register
										</NavLink>
									</li>
								</ul>
							)}
						</div>

						<div className="flex items-center justify-between border-t border-slate-200 px-3 pt-4 dark:border-slate-700">
							<span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
							<ThemeToggle />
						</div>
					</Container>
				</div>
			)}
		</div>
	);
};

export default MobileMenu;
