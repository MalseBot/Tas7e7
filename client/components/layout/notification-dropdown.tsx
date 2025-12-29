/** @format */

// components/layout/notification-dropdown.tsx
'use client';

import { useState } from 'react';
import {
	Bell,
	Check,
	CheckCheck,
	Trash2,
	AlertCircle,
	CheckCircle,
	Info,
	AlertTriangle,
	X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import {
	Notification,
	NotificationType,
	useNotifications,
} from '@/lib/constants/notification-context';
import { useTranslation } from 'react-i18next';

const getNotificationIcon = (type: NotificationType) => {
	switch (type) {
		case 'success':
			return <CheckCircle className='w-4 h-4 text-green-500' />;
		case 'error':
			return <AlertCircle className='w-4 h-4 text-red-500' />;
		case 'warning':
			return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
		case 'info':
		default:
			return <Info className='w-4 h-4 text-blue-500' />;
	}
};

export function NotificationDropdown() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const {
		notifications,
		unreadCount,
		markAsRead,
		markAllAsRead,
		removeNotification,
		clearAllNotifications,
	} = useNotifications();

	const handleNotificationClick = (notification: Notification) => {
		if (!notification.read) {
			markAsRead(notification.id);
		}
		if (notification.action) {
			notification.action.onClick();
		}
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative rounded-full'>
					<Bell className='w-5 h-5' />
					{unreadCount > 0 && (
						<Badge className='absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground'>
							{unreadCount > 9 ? '9+' : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-96 p-0'
				align='end'>
				<div className='sticky top-0 z-10 bg-card border-b'>
					<div className='flex items-center justify-between p-4'>
						<div className='flex items-center gap-2'>
							{unreadCount > 0 && (
								<Badge
									variant='secondary'
									className='text-xs'>
									{unreadCount} {t('common.new')}
								</Badge>
							)}
						</div>
						<div className='flex items-center gap-2'>
							{notifications.length > 0 && unreadCount > 0 && (
								<Button
									variant='ghost'
									size='sm'
									onClick={markAllAsRead}
									className='h-8 text-xs'>
									<CheckCheck className='w-3 h-3 mr-1' />
									{t('common.markAllRead')}
								</Button>
							)}
							{notifications.length > 0 && (
								<Button
									variant='ghost'
									size='sm'
									onClick={clearAllNotifications}
									className='h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50'>
									<Trash2 className='w-3 h-3 mr-1' />
									{t('common.clearAll')}
								</Button>
							)}
						</div>
					</div>
				</div>

				<ScrollArea className='h-100'>
					{notifications.length === 0 ?
						<div className='flex flex-col items-center justify-center h-full p-8 text-center'>
							<Bell className='w-12 h-12 mb-4 text-muted-foreground opacity-50' />
							<p className='font-medium'>{t('common.noNotifications')}</p>
							<p className='text-sm text-muted-foreground'>
								{t('common.allCaughtUp')}
							</p>
						</div>
					:	<div className='divide-y'>
							{notifications.map((notification) => (
								<div
									key={notification.id}
									className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
										!notification.read ? 'bg-accent' : ''
									}`}
									onClick={() => handleNotificationClick(notification)}>
									<div className='flex gap-3'>
										<div className='mt-0.5'>
											{getNotificationIcon(notification.type)}
										</div>
										<div className='flex-1 space-y-1'>
											<div className='flex items-start justify-between'>
												<p className='text-sm font-medium leading-none'>
													{notification.title}
												</p>
												<div className='flex items-center gap-2'>
													{!notification.read && (
														<span className='w-2 h-2 rounded-full bg-blue-500' />
													)}
													<span className='text-xs text-accent-foreground'>
														{formatDistanceToNow(notification.timestamp, {
															addSuffix: true,
														})}
													</span>
													<Button
														variant='ghost'
														size='icon'
														className='h-6 w-6'
														onClick={(e) => {
															e.stopPropagation();
															removeNotification(notification.id);
														}}>
														<X className='w-3 h-3' />
													</Button>
												</div>
											</div>
											<p className='text-sm text-accent-foreground'>
												{notification.message}
											</p>
											{notification.action && (
												<Button
													variant='link'
													size='sm'
													className='h-auto p-0 text-blue-600'
													onClick={(e) => {
														e.stopPropagation();
														notification.action?.onClick();
													}}>
													{notification.action.label}
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					}
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
