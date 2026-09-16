import { safeLocalStorage, safeSessionStorage } from "./safeStorage";

const breakStorage = (method: "getItem" | "setItem" | "removeItem", name: string) =>
	vi.spyOn(Storage.prototype, method).mockImplementation(() => {
		throw new DOMException("storage is not available", name);
	});

describe.each([
	["safeLocalStorage", safeLocalStorage, () => localStorage],
	["safeSessionStorage", safeSessionStorage, () => sessionStorage],
])("%s", (_label, storage, store) => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
		vi.spyOn(console, "warn").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("reads back what it wrote", () => {
		storage.write("key", "value");

		expect(storage.read("key")).toBe("value");
		expect(store().getItem("key")).toBe("value");
	});

	it("returns null for a key that was never set", () => {
		expect(storage.read("missing")).toBeNull();
	});

	it("clear removes the key", () => {
		storage.write("key", "value");

		storage.clear("key");

		expect(storage.read("key")).toBeNull();
		expect(store().getItem("key")).toBeNull();
	});

	it("returns null instead of throwing when the read fails", () => {
		breakStorage("getItem", "SecurityError");

		expect(() => storage.read("key")).not.toThrow();
		expect(storage.read("key")).toBeNull();
	});

	it("swallows a failing write", () => {
		breakStorage("setItem", "QuotaExceededError");

		expect(() => storage.write("key", "value")).not.toThrow();
	});

	it("swallows a failing clear", () => {
		breakStorage("removeItem", "SecurityError");

		expect(() => storage.clear("key")).not.toThrow();
	});
});

describe("safeStorage isolation", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	it("keeps local and session stores separate", () => {
		safeLocalStorage.write("key", "local");
		safeSessionStorage.write("key", "session");

		expect(safeLocalStorage.read("key")).toBe("local");
		expect(safeSessionStorage.read("key")).toBe("session");
	});
});
