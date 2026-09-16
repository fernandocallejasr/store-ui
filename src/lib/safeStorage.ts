const warn = (action: string, error: unknown) => {
	if (import.meta.env.DEV)
		console.warn(`[storage] could not ${action}`, error);
};

export interface SafeStorage {
	read: (key: string) => string | null;
	write: (key: string, value: string) => void;
	clear: (key: string) => void;
}

const createSafeStorage = (getStore: () => Storage): SafeStorage => ({
	read: (key) => {
		try {
			return getStore().getItem(key);
		} catch (error) {
			warn("read", error);
			return null;
		}
	},

	write: (key, value) => {
		try {
			getStore().setItem(key, value);
		} catch (error) {
			warn("write to", error);
		}
	},

	clear: (key) => {
		try {
			getStore().removeItem(key);
		} catch (error) {
			warn("clear", error);
		}
	},
});

export const safeLocalStorage = createSafeStorage(() => window.localStorage);
export const safeSessionStorage = createSafeStorage(() => window.sessionStorage);
