import { z } from 'zod';

export const onboardingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(2, 'Address should be more than 2 characters'),
});

export const invoiceSchema = z.object({
    id: z.string().uuid(),
    invoiceName: z.string().min(1, 'Invoice name is required'),
    total: z.number().int().min(0, 'Total must be a positive integer'),
    status: z.enum(['PAID', 'PENDING']).default('PENDING'),
    date: z.date(),
    dueDate: z.number().int().min(0, 'Due date must be a positive integer'),

    fromName: z.string().min(1, 'From name is required'),
    fromEmail: z.string().email('Invalid email address'),
    fromAddress: z.string().min(1, 'From address is required'),

    clientName: z.string().min(1, 'Client name is required'),
    clientEmail: z.string().email('Invalid email address'),
    clientAddress: z.string().min(1, 'Client address is required'),
    invoiceNumber: z.number().int().min(0, 'Invoice number must be a positive integer'),
    note: z.string().optional(),

    invoiceItemDescription: z.string().min(1, 'Item description is required'),
    invoiceItemQuantity: z.number().int().min(1, 'Item quantity must be at least 1'),
    invoiceItemRate: z.number().int().min(0, 'Item rate must be a positive integer'),

    createdAt: z.date(),
    updatedAt: z.date(),
    userId: z.string().uuid().optional(),
});
