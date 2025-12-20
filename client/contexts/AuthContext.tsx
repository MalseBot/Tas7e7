/** @format */

// contexts/AuthContext.tsx
'use client';

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'manager' | 'cashier' | 'cook';
	isActive: boolean;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	isAuthenticated: boolean;
	updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const clearAuth = () => {
		localStorage.removeItem('cafe-pos-token');
		localStorage.removeItem('cafe-pos-user');
		setUser(null);
		setToken(null);
		delete api.defaults.headers.common['Authorization'];
	};
	
	useEffect(() => {
		const storedToken = localStorage.getItem('cafe-pos-token');
		const storedUser = localStorage.getItem('cafe-pos-user');

		if (storedToken && storedUser) {
			try {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setToken(storedToken);
				setUser(JSON.parse(storedUser));
				api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
			} catch (error) {
				console.error('Failed to parse stored user data:', error);
				clearAuth();
			}
		}
		setIsLoading(false);
	}, []);

	

	const login = async (email: string, password: string) => {
		try {
			const response = await api.post('/auth/login', { email, password });
			const { token, user } = response.data;

			localStorage.setItem('cafe-pos-token', token);
			localStorage.setItem('cafe-pos-user', JSON.stringify(user));

			setToken(token);
			setUser(user);
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

			// Redirect based on role
			if (user.role === 'cashier') {
				router.push('/pos');
			} else if (user.role === 'cook') {
				router.push('/kitchen');
			} else {
				router.push('/dashboard');
			}
		} catch (error: any) {
			throw new Error(error.response?.data?.error || 'Login failed');
		}
	};

	const logout = () => {
		clearAuth();
		router.push('/login');
	};

	const updateUser = (userData: Partial<User>) => {
		if (user) {
			const updatedUser = { ...user, ...userData };
			setUser(updatedUser);
			localStorage.setItem('cafe-pos-user', JSON.stringify(updatedUser));
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
				isLoading,
				isAuthenticated: !!user && !!token,
				updateUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
};
