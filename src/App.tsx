import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import { SpeedInsights } from "@vercel/speed-insights/react";
import './App.css';

function App() {
	return (
		<>
			<Header/>
			<Home/>
			<Footer/>
			<SpeedInsights />
		</>
	);
}

export default App;
