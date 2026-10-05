import type { AuthUser, Session } from "../components/auth/types";

const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export const isJwtShaped = (value: unknown): value is string =>
	typeof value === "string" && JWT_SHAPE.test(value);

export const toAuthUser = (user: AuthUser): AuthUser => (
	{ userId: user.userId, name: user.name }
);

const isAuthUser = (value: unknown): value is AuthUser => {
	if (typeof value !== "object" || value === null)
		return false;

	const user = value as Record<string, unknown>;

	return typeof user.userId === "number" && typeof user.name === "string";
};

export const parseStoredSession = (raw: string | null): Session | null => {
	if (!raw)
		return null;

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}

	if (typeof parsed !== "object" || parsed === null)
		return null;

	const { jwtToken, user } = parsed as Record<string, unknown>;

	if (!isJwtShaped(jwtToken) || !isAuthUser(user))
		return null;

	return { jwtToken, user: toAuthUser(user) };
};
