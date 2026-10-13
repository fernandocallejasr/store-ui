import { buttonClasses, inlineLinkClass } from "./buttonStyles";

const classesOf = (value: string) => value.split(" ");

describe("buttonClasses", () => {
	it("defaults to a medium primary button", () => {
		expect(classesOf(buttonClasses())).toEqual(
			expect.arrayContaining(["bg-primary", "text-on-primary", "px-4", "py-2", "text-sm", "rounded-lg"]),
		);
	});

	it("outlines the secondary variant in the accent", () => {
		expect(classesOf(buttonClasses({ variant: "secondary" }))).toEqual(
			expect.arrayContaining(["border", "border-primary", "text-primary"]),
		);
	});

	it("gives the text variant no padding, so it sits inline with copy", () => {
		const classes = classesOf(buttonClasses({ variant: "text", size: "lg" }));

		expect(classes).toContain("text-base");
		expect(classes.some((name) => /^p[xy]-/.test(name))).toBe(false);
	});

	it("uses the larger padding for size lg", () => {
		expect(classesOf(buttonClasses({ size: "lg" }))).toEqual(
			expect.arrayContaining(["px-6", "py-3", "text-base"]),
		);
	});

	it("never puts white text on the accent", () => {
		expect(buttonClasses()).not.toMatch(/(^| )text-white( |$)/);
	});
});

describe("inlineLinkClass", () => {
	it("underlines links inside sentences, so colour is not the only cue", () => {
		expect(classesOf(inlineLinkClass)).toContain("underline");
	});
});
