/** @format */

'use client';

import { printService } from '../api/print-service';

export function usePrint() {
  const printReceipt = async (order: any) => {
    const receiptData = {
      id: order._id || order.id,
      date: order.createdAt || new Date().toISOString(),
      storeName: 'CafAc POS',
      items: order.items || [],
      total: order.total || 0,
      subtotal: order.subtotal,
      tax: order.tax,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      note: order.kitchenNotes,
    };

    return await printService.printReceipt(receiptData);
  };

  return { printReceipt };
}
