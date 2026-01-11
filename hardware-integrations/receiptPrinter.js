/** @format */

import escpos from 'escpos';
import escposUsb from 'escpos-usb';

// Attach USB adapter
escpos.USB = escposUsb;

const createDevice = () => new escpos.USB();

function formatReceipt(order) {
  const lines = [];
  lines.push((order.storeName || 'Store Name').toUpperCase());
  if (order.storeAddress) lines.push(order.storeAddress);
  lines.push('-----------------------------');
  lines.push(`Order ID: ${order.id || ''}`);
  lines.push(`Date: ${order.date || new Date().toISOString()}`);
  lines.push('-----------------------------');

  (order.items || []).forEach((item) => {
    const name = item.name || '';
    const qty = item.quantity ?? 1;
    const price = typeof item.price === 'number' ? item.price.toFixed(2) : item.price || '';
    const line = `${name} x${qty}  ${price}`;
    lines.push(line);
  });

  lines.push('-----------------------------');
  lines.push(`Subtotal: ${Number(order.subtotal || order.total || 0).toFixed(2)}`);
  if (order.tax) lines.push(`Tax: ${Number(order.tax).toFixed(2)}`);
  if (order.discount) lines.push(`Discount: -${Number(order.discount).toFixed(2)}`);
  lines.push(`Total: ${Number(order.total || 0).toFixed(2)}`);
  if (order.paymentMethod) lines.push(`Payment: ${order.paymentMethod}`);
  lines.push('-----------------------------');
  if (order.note) lines.push(`Note: ${order.note}`);
  lines.push('Thank you for your purchase!');

  return lines;
}

function printReceipt(order = {}) {
  const device = createDevice();
  const printer = new escpos.Printer(device);

  device.open((error) => {
    if (error) {
      console.error('Failed to connect to the printer:', error);
      return;
    }

    const lines = formatReceipt(order);

    // Header formatting
    printer
      .font('A')
      .align('CT')
      .style('B')
      .size(1, 1);

    // Print lines with alignment control for items
    lines.forEach((line) => {
      printer.text(line);
    });

    printer
      .feed(2)
      .cut()
      .close();
  });
}

export { formatReceipt, printReceipt };
