// Shared form-field styling. Borders are slate-500: lighter greys fall under the
// 3:1 contrast WCAG asks of an input's outline.
const fieldSurface =
	"rounded-lg border border-slate-500 bg-white text-base text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent aria-[invalid=true]:border-red-600 dark:border-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:aria-[invalid=true]:border-red-400";

// Without padding, for inputs that reserve room for an icon or a button.
export const inputBaseClass = `w-full ${fieldSurface} placeholder:text-slate-500 dark:placeholder:text-slate-300`;

export const inputClass = `${inputBaseClass} px-3 py-2.5`;

export const selectClass = `${fieldSurface} py-2 pl-3 pr-8`;

export const labelClass = "mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300";

export const hintClass = "mb-1 text-xs text-slate-600 dark:text-slate-400";

// Red is reserved for errors; confirmations stay neutral with an accent icon.
export const formAlertClass =
	"mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300";

export const formNoticeClass =
	"mt-6 flex gap-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600";
