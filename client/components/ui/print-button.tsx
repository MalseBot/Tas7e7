/** @format */

'use client';

import { Button, ButtonProps } from './button';
import { Printer } from 'lucide-react';
import { useState } from 'react';
import { printService } from '@/lib/api/print-service';
import { useToast } from '@/lib/hooks/use-toast';

interface PrintButtonProps extends ButtonProps {
  orderData: any;
  label?: string;
}

export function PrintButton({
  orderData,
  label = 'Print Receipt',
  ...props
}: PrintButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePrint = async () => {
    setIsLoading(true);
    try {
      const receiptData = {
        id: orderData._id || orderData.id,
        date: orderData.createdAt || new Date().toISOString(),
        storeName: 'Café POS',
        items: orderData.items || [],
        total: orderData.total || 0,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        discount: orderData.discount,
        paymentMethod: orderData.paymentMethod,
        note: orderData.kitchenNotes,
      };

      await printService.printReceipt(receiptData);
      toast({
        title: 'Success',
        description: 'Print job sent to printer',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send print job',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePrint}
      disabled={isLoading}
      size='sm'
      {...props}>
      <Printer className='w-4 h-4 mr-2' />
      {isLoading ? 'Printing...' : label}
    </Button>
  );
}
