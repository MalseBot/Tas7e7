/** @format */

// lib/contexts/notification-context.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	timestamp: Date;
	read: boolean;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface NotificationContextType {
	notifications: Notification[];
	unreadCount: number;
	addNotification: (
		notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
	) => void;
	markAsRead: (id: string) => void;
	markAllAsRead: () => void;
	removeNotification: (id: string) => void;
	clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export function NotificationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const addNotification = useCallback(
		(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
			const newNotification: Notification = {
				...notification,
				id: Math.random().toString(36).substring(2, 9),
				timestamp: new Date(),
				read: false,
			};

			setNotifications((prev) => [newNotification, ...prev]);

			// Play notification sound
			if (typeof Audio !== 'undefined') {
				const audio = new Audio('/notification.mp3'); // Add notification sound file
				audio.play().catch(() => {});
			}
		},
		[]
	);

	const markAsRead = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id ? { ...notification, read: true } : notification
			)
		);
	}, []);

	const markAllAsRead = useCallback(() => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, read: true }))
		);
	}, []);

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	}, []);

	const clearAllNotifications = useCallback(() => {
		setNotifications([]);
	}, []);

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				unreadCount,
				addNotification,
				markAsRead,
				markAllAsRead,
				removeNotification,
				clearAllNotifications,
			}}>
			{children}
		</NotificationContext.Provider>
	);
}

export function useNotifications() {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			'useNotifications must be used within NotificationProvider'
		);
	}
	return context;
}
