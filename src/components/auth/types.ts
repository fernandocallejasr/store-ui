export interface User {
	userId: number;
	name: string;
	email: string;
	mobileNumber: string;
}

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface LoginResponse {
	message: string;
	user: User | null;
	jwtToken: string | null;
}
