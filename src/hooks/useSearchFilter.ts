import { useMemo } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

// `fields` is a useMemo dependency: pass a stable reference (module-level
// constant or memoized array) to avoid re-running the filter on every render.
export function useSearchFilter<T>(
	items: T[],
	query: string,
	fields: (keyof T)[],
	delayMs: number = 200,
): T[] {
	const debouncedQuery = useDebouncedValue(query, delayMs);

	return useMemo(() => {
		const normalized = debouncedQuery.trim().toLowerCase();
		if (normalized === "") return items;

		return items.filter((item) =>
			fields.some((field) => {
				const value = item[field];
				return typeof value === "string" && value.toLowerCase().includes(normalized);
			})
		);
	}, [items, debouncedQuery, fields]);
}
