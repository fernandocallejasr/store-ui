import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs: number): T {
	const [debounced, setDebounced] = useState<T>(value);

	useEffect(() => {
		const timeoutId = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(timeoutId);
	}, [value, delayMs]);

	return debounced;
}
