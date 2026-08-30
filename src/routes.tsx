import { lazy } from "react";
import {
	createRoutesFromElements,
	Navigate,
	Route,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./components/home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ErrorPage from "./pages/ErrorPage";
import LoadingView from "./components/status/LoadingView";
import { homeLoader } from "./components/home/homeLoader";

const ProductDetails = lazy(() => import("./pages/ProductDetails"));

export const routes = createRoutesFromElements(
	<Route path="/" element={<MainLayout />} errorElement={<ErrorPage />}>
		<Route
			index
			element={<Home />}
			loader={homeLoader}
			errorElement={<ErrorPage />}
			hydrateFallbackElement={<LoadingView message="Loading…" />}
		/>
		<Route path="home" element={<Navigate to="/" replace />} />
		<Route path="about" element={<About />} />
		<Route path="contact" element={<Contact />} />
		<Route path="login" element={<Login />} />
		<Route path="cart" element={<Cart />} />
		<Route path="products/:id" element={<ProductDetails />} />
	</Route>,
);
