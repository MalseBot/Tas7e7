/** @format */

import express from 'express';
import { printReceipt } from '../hardware-integrations/receiptPrinter.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const order = req.body;
    // Fire-and-forget printing; don't block the response
    try {
      printReceipt(order);
    } catch (printerErr) {
      console.error('Printer error:', printerErr);
      // continue; we don't want to fail the API just because printing failed
    }

    res.json({ success: true, message: 'Print job queued' });
  } catch (err) {
    next(err);
  }
});

export default router;
