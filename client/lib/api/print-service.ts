/** @format */

import { api } from "./client";


interface PrintReceiptData {
  id: string;
  date: string;
  storeName?: string;
  storeAddress?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal?: number;
  tax?: number;
  discount?: number;
  total: number;
  paymentMethod?: string;
  note?: string;
}

export const printService = {
  async printReceipt(order: PrintReceiptData) {
    try {
      const response = await api.post('/print', order);
      return response.data;
    } catch (error) {
      console.error('Print service error:', error);
      throw error;
    }
  },

  async printOrderReceipt(orderId: string) {
    try {
      const response = await api.post(`/print`, { orderId });
      return response.data;
    } catch (error) {
      console.error('Print order receipt error:', error);
      throw error;
    }
  },
};
