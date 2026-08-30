import axios from "axios";

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: {
		Accept: "application/json",
	},
	timeout: Number(import.meta.env.VITE_AXIOS_DEFAULT_TIMEOUT)
});

export default apiClient;