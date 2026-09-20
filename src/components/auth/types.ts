export interface User {
	userId: number;
	name: string;
	email: string;
	mobileNumber: string;
}

export type AuthUser = Pick<User, "userId" | "name">;

export interface Session {
	jwtToken: string;
	user: AuthUser;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterCredentials {
	name: string;
	email: string;
	mobileNumber: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	user: User | null;
	jwtToken: string | null;
}
