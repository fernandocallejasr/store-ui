import { isJwtShaped, parseStoredSession } from "./sessionValidation";

// header {"alg":"HS256"}, payload {"sub":"1"}; the signature uses both base64url
// characters that standard base64 lacks.
const SIGNED_JWT = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc-DEF_123";

const stored = (session: unknown) => JSON.stringify(session);

describe("isJwtShaped", () => {
	it.each([
		["a minimal token", "a.b.c"],
		["a realistic signed token", SIGNED_JWT],
	])("accepts %s", (_label, token) => {
		expect(isJwtShaped(token)).toBe(true);
	});

	it.each([
		["an empty string", ""],
		["a single segment", "abc"],
		["two segments", "a.b"],
		["four segments", "a.b.c.d"],
		["an empty signature (an unsigned token)", "a.b."],
		["an empty header", ".b.c"],
		["standard base64 characters", "a+b.c/d.e="],
		["a space", "a.b c.d"],
		["leading whitespace", " a.b.c"],
		["trailing whitespace", "a.b.c "],
		["a CRLF that would inject a header", "a.b.c\r\nX-Injected: 1"],
		["a bare LF", "a.b.c\n"],
		["a non-string", 123],
		["null", null],
		["an object", { token: "a.b.c" }],
	])("rejects %s", (_label, token) => {
		expect(isJwtShaped(token)).toBe(false);
	});
});

describe("parseStoredSession", () => {
	it("returns null when nothing is stored", () => {
		expect(parseStoredSession(null)).toBeNull();
		expect(parseStoredSession("")).toBeNull();
	});

	it("restores a well-formed session", () => {
		const session = { jwtToken: SIGNED_JWT, user: { userId: 1, name: "My User" } };

		expect(parseStoredSession(stored(session))).toEqual(session);
	});

	it("drops contact details left in a stored user", () => {
		const raw = stored({
			jwtToken: "a.b.c",
			user: { userId: 1, name: "My User", email: "myuser@example.com", mobileNumber: "5550000" },
		});

		expect(parseStoredSession(raw)).toEqual({ jwtToken: "a.b.c", user: { userId: 1, name: "My User" } });
	});

	it.each([
		["text that isn't JSON at all", "{not json"],
		["the literal null", "null"],
		["a bare number", "42"],
		["an array", "[]"],
		["an empty token", '{"jwtToken":"","user":{"userId":1,"name":"My User"}}'],
		["a missing token", '{"user":{"userId":1,"name":"My User"}}'],
		["a non-string token", '{"jwtToken":123,"user":{"userId":1,"name":"My User"}}'],
		["a token that is not a JWT", '{"jwtToken":"not-a-jwt","user":{"userId":1,"name":"My User"}}'],
		["a token carrying a CRLF", '{"jwtToken":"a.b.c\\r\\nX-Injected: 1","user":{"userId":1,"name":"My User"}}'],
		["a token but no user", '{"jwtToken":"a.b.c"}'],
		["a user that is a string", '{"jwtToken":"a.b.c","user":"My User"}'],
		["a user that is an array", '{"jwtToken":"a.b.c","user":[]}'],
		["a userId of the wrong type", '{"jwtToken":"a.b.c","user":{"userId":"1","name":"My User"}}'],
		["a user with no name", '{"jwtToken":"a.b.c","user":{"userId":1}}'],
	])("treats %s as no session", (_label, raw) => {
		expect(parseStoredSession(raw)).toBeNull();
	});
});
