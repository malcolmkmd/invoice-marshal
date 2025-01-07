'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';
import prisma from './utils/db';
import { getSession } from './utils/hooks';
import { onboardingSchema, invoiceSchema } from './utils/zodSchemas';
import { emailClient } from './utils/mailtrap';
import { currencyFormatter } from './utils/currencyFormatter';
import { dateFormatter } from './utils/dateFormatter';

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

  return redirect('/dashboard');
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  console.log('here');
  const session = await getSession();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  await prisma.invoice.create({
    data: {
      ...submission.value,
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
        invoiceNumber: submission.value.invoiceNumber,
        date: dateFormatter(submission.value.date),
        totalAmount: currencyFormatter({ amount: submission.value.invoiceNumber, currency: 'ZAR' }),
        invoiceLink: 'Test_InvoiceLink',
      },
    })
    .then(console.log, console.error);

  return redirect('/dashboard/invoices');
}
