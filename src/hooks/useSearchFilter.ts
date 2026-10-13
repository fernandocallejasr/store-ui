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

	// A delay of 0 means the caller has already debounced, so filter on the query
	// as given; the result never trails what the caller is showing.
	const activeQuery = delayMs === 0 ? query : debouncedQuery;

	return useMemo(() => {
		const normalized = activeQuery.trim().toLowerCase();
		if (normalized === "") return items;

		return items.filter((item) =>
			fields.some((field) => {
				const value = item[field];
				return typeof value === "string" && value.toLowerCase().includes(normalized);
			})
		);
	}, [items, activeQuery, fields]);
}
