import { act, renderHook } from "@testing-library/react";
import { useSearchFilter } from "./useSearchFilter";

type Item = { name: string; description: string };

const items: Item[] = [
	{ name: "Sticker Alpha", description: "First sticker" },
	{ name: "Sticker Beta", description: "Second sticker with cat" },
	{ name: "Pin Gamma", description: "Third item" },
];

describe("useSearchFilter", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns all items when the query is empty", () => {
		const { result } = renderHook(() =>
			useSearchFilter(items, "", ["name", "description"], 200)
		);
		expect(result.current).toBe(items);
	});

	it("matches case-insensitively across configured fields after the debounce delay", () => {
		const { result, rerender } = renderHook(
			({ query }) => useSearchFilter(items, query, ["name", "description"], 200),
			{ initialProps: { query: "" } }
		);

		rerender({ query: "CAT" });
		expect(result.current).toHaveLength(3);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current).toHaveLength(1);
		expect(result.current[0].name).toBe("Sticker Beta");
	});

	it("matches against name field", () => {
		const { result } = renderHook(() =>
			useSearchFilter(items, "pin", ["name", "description"], 0)
		);

		act(() => {
			vi.advanceTimersByTime(0);
		});

		expect(result.current).toHaveLength(1);
		expect(result.current[0].name).toBe("Pin Gamma");
	});

	it("returns empty array when nothing matches", () => {
		const { result } = renderHook(() =>
			useSearchFilter(items, "nonexistent", ["name", "description"], 0)
		);

		act(() => {
			vi.advanceTimersByTime(0);
		});

		expect(result.current).toHaveLength(0);
	});
});
