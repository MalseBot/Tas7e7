/** @format */

// app/dashboard/orders/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { orderService } from '@/lib/api/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from '@/components/ui/table';
import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
Search,
Calendar,
Filter,
Eye,
Receipt,
MoreHorizontal,
Printer,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePrint } from '@/lib/hooks/usePrint';
import { useToast } from '@/lib/hooks/use-toast';

export default function OrdersPage() {
const { t } = useTranslation();
const { printReceipt } = usePrint();
const { toast } = useToast();
const [searchQuery, setSearchQuery] = useState('');
const [dateFilter, setDateFilter] = useState('today');
const [statusFilter, setStatusFilter] = useState('all');
const [printingOrderId, setPrintingOrderId] = useState<string | null>(null);

const { data: orders, isLoading } = useQuery({
queryKey: ['orders', { dateFilter, statusFilter }],
queryFn: () => {
const now = new Date();
let startDate: string | undefined;
let endDate: string | undefined;

switch (dateFilter) {
case 'today': {
const start = new Date(now);
start.setHours(0, 0, 0, 0);
const end = new Date(now);
end.setHours(23, 59, 59, 999);
startDate = start.toISOString();
endDate = end.toISOString();
break;
}
case 'week': {
const start = new Date(now);
start.setDate(now.getDate() - 6);
start.setHours(0, 0, 0, 0);
const end = new Date(now);
end.setHours(23, 59, 59, 999);
startDate = start.toISOString();
endDate = end.toISOString();
break;
}
case 'month': {
const start = new Date(now.getFullYear(), now.getMonth(), 1);
startDate = start.toISOString();
endDate = now.toISOString();
break;
}
default:
break;
}

return orderService.getOrders({
status: statusFilter !== 'all' ? statusFilter : undefined,
startDate,
endDate,
});
},
});

// Print mutation with tanstack
const printMutation = useMutation({
mutationFn: (order: any) => printReceipt(order),
onSuccess: () => {
toast({
title: 'Success',
description: 'Receipt sent to printer',
});
setPrintingOrderId(null);
},
onError: (error) => {
toast({
title: 'Error',
description: 'Failed to print receipt',
variant: 'destructive',
});
setPrintingOrderId(null);
},
});

const handlePrintReceipt = (order: any) => {
setPrintingOrderId(order._id);
printMutation.mutate(order);
};

const getStatusBadge = (status: string) => {
const variants: Record<string, any> = {
pending: { variant: 'destructive' as const, label: t('orders.pending') },
preparing: {
variant: 'secondary' as const,
label: t('orders.preparing'),
},
ready: { variant: 'default' as const, label: t('orders.ready') },
served: { variant: 'default' as const, label: t('orders.served') },
paid: { variant: 'outline' as const, label: t('orders.paid') },
cancelled: {
variant: 'destructive' as const,
label: t('orders.cancelled'),
},
};
return variants[status] || { variant: 'outline' as const, label: status };
};

const getDateFilterText = (filter: string) => {
switch (filter) {
case 'today':
return t('orders.today');
case 'week':
return t('orders.thisWeek');
case 'month':
return t('orders.thisMonth');
case 'all':
return t('orders.allTime');
default:
return filter;
}
};

const getStatusFilterText = (filter: string) => {
if (filter === 'all') return t('orders.allStatus');
return getStatusBadge(filter).label;
};

const filteredOrders = orders?.data.data?.filter(
(order: any) =>
order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
order.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
<div className='space-y-6'>
{/* Header */}
<div>
<h1 className='text-3xl font-bold text-foreground'>
{t('orders.title')}
</h1>
<p className='text-muted-foreground'>{t('orders.subtitle')}</p>
</div>

{/* Filters */}
<Card>
<CardContent className='p-6'>
<div className='flex flex-col md:flex-row gap-4'>
<div className='flex-1'>
<div className='relative'>
<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
<Input
placeholder={t('orders.searchPlaceholder')}
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className='pl-10'
/>
</div>
</div>

<div className='flex gap-2'>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant='outline'
className='gap-2'>
<Calendar className='w-4 h-4' />
{t('orders.date')}
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent>
<DropdownMenuItem onClick={() => setDateFilter('today')}>
{t('orders.today')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setDateFilter('week')}>
{t('orders.thisWeek')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setDateFilter('month')}>
{t('orders.thisMonth')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setDateFilter('all')}>
{t('orders.allTime')}
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>

<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant='outline'
className='gap-2'>
<Filter className='w-4 h-4' />
{t('orders.status')}
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent>
<DropdownMenuItem onClick={() => setStatusFilter('all')}>
{t('orders.allStatus')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setStatusFilter('pending')}>
{t('orders.pending')}
</DropdownMenuItem>
<DropdownMenuItem
onClick={() => setStatusFilter('preparing')}>
{t('orders.preparing')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setStatusFilter('ready')}>
{t('orders.ready')}
</DropdownMenuItem>
<DropdownMenuItem onClick={() => setStatusFilter('paid')}>
{t('orders.paid')}
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</div>
</div>
</CardContent>
</Card>

{/* Orders Table */}
<Card>
<CardHeader>
<CardTitle>
{t('orders.title')} ({filteredOrders?.length || 0})
</CardTitle>
</CardHeader>
<CardContent>
<Table>
<TableHeader>
<TableRow>
<TableHead>{t('orders.orderNumber')}</TableHead>
<TableHead>{t('orders.dateTime')}</TableHead>
<TableHead>{t('orders.customer')}</TableHead>
<TableHead>{t('orders.table')}</TableHead>
<TableHead>{t('orders.items')}</TableHead>
<TableHead>{t('orders.total')}</TableHead>
<TableHead>{t('orders.status')}</TableHead>
<TableHead className='text-right'>
{t('orders.actions')}
</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{filteredOrders?.map((order: any) => {
const statusBadge = getStatusBadge(order.status);
const isPrinting = printingOrderId === order._id && printMutation.isPending;
return (
<TableRow key={order._id}>
<TableCell className='font-medium'>
{order.orderNumber}
</TableCell>
<TableCell>
<div className='text-sm'>
<div>
{new Date(order.createdAt).toLocaleDateString()}
</div>
<div className='text-muted-foreground'>
{new Date(order.createdAt).toLocaleTimeString()}
</div>
</div>
</TableCell>
<TableCell>
{order.customerName || t('orders.walkIn')}
</TableCell>
<TableCell>
{order.tableNumber === 'Takeaway' || order.tableNumber === 'pos.takeaway' ?
<Badge variant='outline'>{t('orders.takeaway')}</Badge>
:order.tableNumber}
</TableCell>
<TableCell>
{order.items.reduce(
(sum: number, item: any) => sum + item.quantity,
0
)}{' '}
{t('orders.items')}
</TableCell>
<TableCell className='font-semibold'>
${order.total?.toFixed(2) || '0.00'}
</TableCell>
<TableCell>
<Badge variant={statusBadge.variant}>
{statusBadge.label}
</Badge>
</TableCell>
<TableCell className='text-right'>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button
variant='ghost'
size='icon'
disabled={isPrinting}>
<MoreHorizontal className='w-4 h-4' />
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align='end'>
<DropdownMenuLabel>
{t('orders.actions')}
</DropdownMenuLabel>
<DropdownMenuSeparator />
<DropdownMenuItem>
<Eye className='w-4 h-4 mr-2' />
{t('orders.viewDetails')}
</DropdownMenuItem>
<DropdownMenuItem 
onClick={() => handlePrintReceipt(order)}
disabled={isPrinting}>
<Printer className='w-4 h-4 mr-2' />
{isPrinting ? 'Printing...' : t('orders.printReceipt')}
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</TableCell>
</TableRow>
);
})}
</TableBody>
</Table>

{(!filteredOrders || filteredOrders.length === 0) && (
<div className='text-center py-12 text-muted-foreground'>
<Receipt className='w-12 h-12 mx-auto mb-4 opacity-50' />
<p>{t('orders.noOrdersFound')}</p>
<p className='text-sm mt-2'>
{searchQuery ?
t('orders.tryDifferentSearch')
:t('orders.startTakingOrders')}
</p>
</div>
)}
</CardContent>
</Card>
</div>
);
}
