import { act, renderHook } from "@testing-library/react";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebouncedValue("hello", 200));
		expect(result.current).toBe("hello");
	});

	it("updates the debounced value only after the delay", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 200),
			{ initialProps: { value: "a" } }
		);

		rerender({ value: "ab" });
		expect(result.current).toBe("a");

		act(() => {
			vi.advanceTimersByTime(199);
		});
		expect(result.current).toBe("a");

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe("ab");
	});

	it("resets the timer when the value changes again before the delay elapses", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedValue(value, 200),
			{ initialProps: { value: "a" } }
		);

		rerender({ value: "ab" });
		act(() => {
			vi.advanceTimersByTime(150);
		});
		rerender({ value: "abc" });
		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current).toBe("a");

		act(() => {
			vi.advanceTimersByTime(50);
		});
		expect(result.current).toBe("abc");
	});
});
