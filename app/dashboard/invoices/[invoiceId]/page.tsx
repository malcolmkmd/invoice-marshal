import { Invoice } from '@prisma/client';
import { NextResponse } from 'next/server';
import prisma from '../../../utils/db';
import { getSession } from '../../../utils/hooks';
import EditInvoice from './EditInvoice';

interface InvoiceError {
  error: string;
}

async function getData(invoiceId: string, userId: string): Promise<Invoice | InvoiceError> {
  try {
    const data = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: userId,
      },
    });

    // Check if the invoice exists and belongs to the user
    if (!data || data.userId !== userId) {
      return { error: 'Invoice not found or unauthorized' };
    }

    return data;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export default async function EditInvoiceRoute({ params }: { params: { invoiceId: string } }) {
  const { invoiceId } = await params;
  if (!invoiceId) {
    console.error('No invoice ID provided');
    return;
  }

  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.redirect('/login');
  }
  const data = await getData(invoiceId, session.user?.id as string);
  if ('error' in data) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }
  return <EditInvoice {...data} invoice={data} />;
}
