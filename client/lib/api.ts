/** @format */

// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 30000, // 30 seconds timeout for POS operations
});

// Request interceptor
api.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('cafe-pos-token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && typeof window !== 'undefined') {
			// Clear auth and redirect to login
			localStorage.removeItem('cafe-pos-token');
			localStorage.removeItem('cafe-pos-user');
			window.location.href = '/login';
		}

		// Handle network errors
		if (!error.response) {
			console.error('Network error:', error);
			throw new Error('Network error. Please check your connection.');
		}

		// Handle server errors
		if (error.response.status >= 500) {
			console.error('Server error:', error);
			throw new Error('Server error. Please try again later.');
		}

		return Promise.reject(error);
	}
);

// Helper functions
export const fetchWithRetry = async (
	url: string,
	options: RequestInit = {},
	retries = 3
): Promise<any> => {
	try {
		const response = await fetch(`${API_URL}${url}`, options);
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return await response.json();
	} catch (error) {
		if (retries > 0) {
			console.log(`Retrying ${url}, attempts left: ${retries}`);
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
			return fetchWithRetry(url, options, retries - 1);
		}
		throw error;
	}
};
