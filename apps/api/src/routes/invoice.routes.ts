import { Router } from 'express';
import multer from 'multer'; 
import pdf from 'pdf-parse';
import { Invoice } from '../models/invoice.model';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

router.post('/extract', upload.single('invoice'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided for extraction.' });
  }
  try {
    const pdfData = await pdf(req.file.buffer);
    const pdfText = pdfData.text;
    const prompt = `
      Based on the invoice text, extract data into a valid JSON object.
      Only output the JSON object. The JSON structure is:
      {
        "vendor": { "name": "string", "address": "string", "taxId": "string" },
        "invoice": { "number": "string", "date": "string", "currency": "string", "subtotal": "number", "taxPercent": "number", "total": "number", "poNumber": "string", "poDate": "string" },
        "lineItems": [{ "description": "string", "unitPrice": "number", "quantity": "number", "total": "number", "discount": "number", "vat": "number" }]
      }
      Invoice Text: --- ${pdfText} ---
    `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    let jsonResponse = response.text().replace(/```json/g, '').replace(/```/g, '');
    const parsedJson = JSON.parse(jsonResponse);
    res.status(200).json(parsedJson);
  } catch (error) {
    console.error('Error during Gemini AI extraction:', error);
    res.status(500).json({ error: 'Failed to extract data from the PDF.' });
  }
});

router.post('/invoices', async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Failed to create invoice.' });
  }
});

router.get('/invoices', async (req, res) => {
  try {
    const { q } = req.query;
    let filter = {};
    if (q && typeof q === 'string') {
      const regex = new RegExp(q, 'i');
      filter = { $or: [{ 'vendor.name': regex }, { 'invoice.number': regex }] };
    }
    const invoices = await Invoice.find(filter);
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices.' });
  }
});

router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error fetching single invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice.' });
  }
});

router.put('/invoices/:id', async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice.' });
  }
});

router.delete('/invoices/:id', async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Failed to delete invoice.' });
  }
});

export default router;