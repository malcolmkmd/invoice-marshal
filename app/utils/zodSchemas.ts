import { z } from 'zod';

export const onboardingSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  address: z.string().min(2, 'Address should be more than 2 characters'),
  bankAccountName: z.string().min(1, 'Bank account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  branchCode: z.string().min(1, 'Branch code is required'),
  bankName: z.string().min(1, 'Bank name is required'),
});

// New schema for individual invoice items
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.string().min(1, 'Quantity is required').transform(Number),
  rate: z.string().min(1, 'Rate is required').transform(Number),
});

// Updated invoice schema
export const invoiceSchema = z.object({
  id: z.string().optional(),
  fromName: z.string().min(1, 'From name is required'),
  fromEmail: z.string().email('Invalid email address'),
  fromAddress: z.string().min(1, 'From address is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientAddress: z.string().min(1, 'Client address is required'),
  dueDate: z.string().transform((str) => new Date(str)),
  items: z.array(invoiceItemSchema),
  note: z.string().optional(),
});

// Type for invoice items
export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
