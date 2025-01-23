'use server';

import { parseWithZod } from '@conform-to/zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { currencyFormatter } from './utils/currencyFormatter';
import { standardDate } from './utils/dateFormatter';
import prisma from './utils/db';
import { getSession } from './utils/hooks';
import { emailClient } from './utils/mailtrap';
import { invoiceSchema, onboardingSchema } from './utils/zodSchemas';

export async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: userId,
    },
  });

  if (!data) {
    return redirect('/dashboard/invoices');
  }
}

export async function onboardUser(prevState: unknown, formData: FormData) {
  const session = await getSession();
  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      ...submission.value,
    },
  });

  console.log('User onboarded successfully');
  return redirect('/dashboard/invoices');
}

async function generateInvoiceNumber(): Promise<string> {
  const prefix = 'KUM';

  // Atomically update the counter
  const counter = await prisma.counter.upsert({
    where: { entity: 'invoice' },
    update: { lastNumber: { increment: 1 } },
    create: { entity: 'invoice', lastNumber: 1 },
  });

  // Use the incremented number to generate the invoice number
  return `${prefix}${counter.lastNumber.toString().padStart(4, '0')}`;
}

export async function sendInvoiceEmail(
  invoice: any,
  clientName: string,
  clientEmail: string,
  total: number,
) {
  const sender = {
    email: 'accounts@kumwenda-inc.co.za',
    name: 'Accounts @Kumwenda-Inc',
  };
  const recipients = [{ email: clientEmail }];

  return emailClient.send({
    from: sender,
    to: recipients,
    template_uuid: 'ae5da7be-96c2-45c8-8612-2aeec3a4531d',
    template_variables: {
      clientName,
      invoiceNumber: invoice.invoiceNumber,
      dueDate: standardDate(invoice.dueDate),
      totalAmount: currencyFormatter(total),
      invoiceLink:
        process.env.NODE_ENV !== 'production'
          ? `http://localhost:3000/api/invoice/${invoice.id}`
          : `https://invoice-marshal-green.vercel.app/api/invoice/${invoice.id}`,
    },
  });
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  const session = await getSession();
  const invoiceNumber = await generateInvoiceNumber();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const total = submission.value.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const createdInvoice = await prisma.invoice.create({
    data: {
      ...submission.value,
      items: {
        create: submission.value.items,
      },
      invoiceNumber,
      userId: session.user?.id,
      total,
      status: 'CREATED',
    },
  });

  return redirect(`/dashboard/invoices`);
}

export async function editInvoice(prevState: unknown, formData: FormData) {
  const session = await getSession();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const editedInvoice = await prisma.invoice.update({
    where: {
      id: formData.get('id') as string,
      userId: session.user?.id,
    },
    data: {
      ...submission.value,
      items: {
        deleteMany: {},
        create: submission.value.items,
      },
    },
  });

  const sender = {
    email: 'accounts@kumwenda-inc.co.za',
    name: 'Accounts @Kumwenda-Inc',
  };
  const recipients = [
    {
      email: submission.value.clientEmail,
    },
  ];

  emailClient
    .send({
      from: sender,
      to: recipients,
      template_uuid: 'e3101592-6027-422f-8d5a-fc7d5d65c8f4',
      template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: editedInvoice.invoiceNumber,
        dueDate: standardDate(submission.value.dueDate),
        totalAmount: currencyFormatter(
          submission.value.items.reduce((sum, item) => sum + item.quantity * item.rate, 0),
        ),
        invoiceLink:
          process.env.NODE_ENV !== 'production'
            ? `http://localhost:3000/api/invoice/${editedInvoice.id}`
            : `https://invoice-marshal-green.vercel.app/api/invoice/${editedInvoice.id}`,
      },
    })
    .then(console.log, console.error);

  return redirect('/dashboard/invoices');
}

export async function deleteInvoice(invoiceId: string) {
  const session = await getSession();

  await prisma.invoice.delete({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
  });
  return redirect('/dashboard/invoices');
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await getSession();
  await prisma.invoice.delete({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
  });
  revalidatePath('/dashboard/invoices');
  return redirect('/dashboard/invoices');
}

export async function MarkAsPaid(invoiceId: string) {
  const session = await getSession();
  await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: 'PAID',
    },
  });
  return redirect('/dashboard/invoices');
}

export async function sendInvoice(invoiceId: string) {
  const session = await getSession();

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
    select: {
      id: true,
      items: true,
      clientName: true,
      clientEmail: true,
      dueDate: true,
      invoiceNumber: true,
    },
  });

  if (!invoice) {
    throw new Error('Invoice not found');
  }

  const total = invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  await sendInvoiceEmail(invoice, invoice.clientName, invoice.clientEmail, total);

  await prisma.invoice.update({
    where: {
      id: invoiceId,
      userId: session.user?.id,
    },
    data: {
      status: 'SENT',
    },
  });

  return { success: true };
}

export async function getInvoices() {
  const session = await getSession();
  return prisma.invoiceWithComputedStatus.findMany({
    where: { userId: session.user?.id },
  });
}

export async function getInvoice(id: string) {
  const session = await getSession();
  return prisma.invoiceWithComputedStatus.findUnique({
    where: {
      id,
      userId: session.user?.id,
    },
  });
}
