import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { safeSessionStorage } from "../../lib/safeStorage";
import { useEffect } from "react";

export const REDIRECT_PATH_STORAGE_KEY = "redirectPath";
export const HOME_PATH = "/";
export const LOGIN_PATH = "/login";

export const ProtectedRoute = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	useEffect(() => {
		if (!isAuthenticated && location.pathname !== LOGIN_PATH)
			safeSessionStorage.write(REDIRECT_PATH_STORAGE_KEY, location.pathname);

	}, [isAuthenticated, location.pathname]);

	return isAuthenticated ? <Outlet /> :
							 <Navigate to={LOGIN_PATH} replace />
};