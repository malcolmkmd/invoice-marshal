import { z } from 'zod';

export const onboardingSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  address: z.string().min(2, 'Address should be more than 2 characters'),
});

export const invoiceSchema = z.object({
  id: z.string().min(1).optional(),
  total: z.number().min(0),
  status: z.enum(['PAID', 'PENDING']).default('PENDING'),
  date: z
    .string()
    .nonempty('Date is required')
    .transform((value) => new Date(value)),
  dueDate: z.number().int().min(0, 'Due date must be a positive integer'),

  fromName: z.string().min(1, 'From name is required'),
  fromEmail: z.string().email('Invalid email address'),
  fromAddress: z.string().min(1, 'From address is required'),

  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email address'),
  clientAddress: z.string().min(1, 'Client address is required'),
  note: z.string().optional(),

  invoiceItemDescription: z.string().min(1, 'Item description is required'),
  invoiceItemQuantity: z.number().int().min(1, 'Item quantity must be at least 1'),
  invoiceItemRate: z.number().int().min(0, 'Item rate must be a positive integer'),
});
