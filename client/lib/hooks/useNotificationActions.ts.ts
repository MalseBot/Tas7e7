/** @format */

import { useNotifications } from "../constants/notification-context";

// hooks/useNotificationActions.ts

export function useNotificationActions() {
	const { addNotification } = useNotifications();

	const notifySuccess = (title: string, message: string, action?: any) => {
		addNotification({
			title,
			message,
			type: 'success',
			action,
		});
	};

	const notifyError = (title: string, message: string, action?: any) => {
		addNotification({
			title,
			message,
			type: 'error',
			action,
		});
	};

	const notifyInfo = (title: string, message: string, action?: any) => {
		addNotification({
			title,
			message,
			type: 'info',
			action,
		});
	};

	const notifyWarning = (title: string, message: string, action?: any) => {
		addNotification({
			title,
			message,
			type: 'warning',
			action,
		});
	};

	return {
		notifySuccess,
		notifyError,
		notifyInfo,
		notifyWarning,
	};
}
