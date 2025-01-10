'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';
import { currencyFormatter } from './utils/currencyFormatter';
import { standardDateTime } from './utils/dateFormatter';
import prisma from './utils/db';
import { getSession } from './utils/hooks';
import { emailClient } from './utils/mailtrap';
import { invoiceSchema, onboardingSchema } from './utils/zodSchemas';

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
  return redirect('/dashboard');
}

async function generateInvoiceNumber(): Promise<string> {
  const prefix = 'INV-';

  // Find the highest current invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: {
      createdAt: 'desc', // Ensure the latest invoice is retrieved
    },
    select: {
      invoiceNumber: true,
    },
  });

  // Extract the numeric part and increment it
  const lastNumber = lastInvoice?.invoiceNumber
    ? parseInt(lastInvoice.invoiceNumber.replace(prefix, ''), 10)
    : 0;

  const nextNumber = lastNumber + 1;

  // Generate the new invoice number
  return `${prefix}${nextNumber.toString().padStart(6, '0')}`;
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

  const createdInvoice = await prisma.invoice.create({
    data: {
      ...submission.value,
      invoiceNumber: invoiceNumber,
      userId: session.user?.id,
    },
  });

  const sender = {
    email: 'hello@demomailtrap.com',
    name: 'Mailtrap Test',
  };
  const recipients = [
    {
      email: 'malcolmcollin@gmail.com',
    },
  ];

  emailClient
    .send({
      from: sender,
      to: recipients, // [{email: submission.value.client.email}]
      template_uuid: '821b7b5d-910c-465f-b24f-502111741328',
      template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: createdInvoice.invoiceNumber,
        date: standardDateTime(submission.value.date),
        totalAmount: currencyFormatter(submission.value.total),
        invoiceLink: `http://localhost:3000/api/invoice/${createdInvoice.id}`,
      },
    })
    .then(console.log, console.error);

  return redirect('/dashboard/invoices');
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
    },
  });

  const sender = {
    email: 'hello@demomailtrap.com',
    name: 'Mailtrap Test',
  };
  const recipients = [
    {
      email: 'malcolmcollin@gmail.com',
    },
  ];

  emailClient
    .send({
      from: sender,
      to: recipients, // [{email: submission.value.client.email}]
      template_uuid: 'ea465341-9b46-49a4-bee4-575bff70382a',
      template_variables: {
        clientName: submission.value.clientName,
        invoiceNumber: editedInvoice.invoiceNumber,
        date: standardDateTime(submission.value.date),
        totalAmount: currencyFormatter(submission.value.total),
        invoiceLink: `http://localhost:3000/api/invoice/${editedInvoice.id}`,
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
