import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || '/api',
	headers: { 'Content-Type': 'application/json' },
	timeout: 15000,
});

api.interceptors.request.use((config) => {
	const requestUrl = config.url || "";
	const publicAuthRequest = [
		"/auth/register",
		"/auth/login",
		"/auth/verify-email",
		"/auth/resend-verification-email",
		"/auth/verify-otp",
		"/auth/oauth/",
	].some((path) => requestUrl.includes(path));
	const token = localStorage.getItem("accessToken");

	if (token && !publicAuthRequest) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default api;
