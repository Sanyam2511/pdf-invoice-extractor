import { Schema, model } from 'mongoose';

const LineItemSchema = new Schema({
  description: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  discount: { type: Number },
  vat: { type: Number }, 
});

const InvoiceSchema = new Schema({
  fileId: { type: String, required: true },
  fileName: { type: String, required: true },
  vendor: {
    name: { type: String, required: true },
    address: String,
    taxId: String,
  },
  invoice: {
    number: { type: String, required: true },
    date: String,
    currency: String,
    subtotal: Number,
    taxPercent: Number,
    total: Number,
    poNumber: String,
    poDate: String,
  },
  lineItems: [LineItemSchema],
}, {
  timestamps: true 
});

export const Invoice = model('Invoice', InvoiceSchema);