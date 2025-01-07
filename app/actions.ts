'use server';

import { parseWithZod } from '@conform-to/zod';
import { redirect } from 'next/navigation';
import prisma from './utils/db';
import { requireUser } from './utils/hooks';
import { onboardingSchema, invoiceSchema } from './utils/zodSchemas';

export async function onboardUser(prevState: unknown, formData: FormData) {
  const session = await requireUser();
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
  await requireUser();
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      ...submission.value,
    },
  });
}
