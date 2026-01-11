/** @format */

'use client';

import { printService } from '../api/print-service';
import { useToast } from './use-toast';

export function usePrint() {
  const { toast } = useToast();

  const printReceipt = async (order: any) => {
    try {
      const receiptData = {
        id: order._id || order.id,
        date: order.createdAt || new Date().toISOString(),
        storeName: 'Café POS',
        items: order.items || [],
        total: order.total || 0,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        paymentMethod: order.paymentMethod,
        note: order.kitchenNotes,
      };

      await printService.printReceipt(receiptData);
      
      toast({
        title: 'Success',
        description: 'Print job sent to printer',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send print job',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { printReceipt };
}
