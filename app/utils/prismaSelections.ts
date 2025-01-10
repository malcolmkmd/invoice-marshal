import { Prisma } from '@prisma/client';

export const InvoiceSelection: Prisma.InvoiceSelect = {
  invoiceName: true,
  invoiceNumber: true,
  currency: true,
  fromName: true,
  fromEmail: true,
  fromAddress: true,
  clientName: true,
  clientEmail: true,
  clientAddress: true,
  date: true,
  dueDate: true,
  invoiceItemDescription: true,
  invoiceItemQuantity: true,
  invoiceItemRate: true,
  total: true,
};
