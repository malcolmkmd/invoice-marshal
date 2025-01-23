import { NextResponse } from 'next/server';
import prisma from '../../../utils/db';
import { getSession } from '../../../utils/hooks';
import { emailClient } from '../../../utils/mailtrap';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const session = await getSession();
    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    const sender = {
      email: 'accounts@kumwenda-inc.co.za',
      name: 'Accounts @Kumwenda-Inc',
    };
    const recipients = [
      {
        email: invoice?.clientEmail ?? '',
      },
    ];

    emailClient
      .send({
        from: sender,
        to: recipients,
        template_uuid: '3bd3b4f4-eef1-4d3f-b4db-643fd8f16a06',
        template_variables: {
          clientName: invoice?.clientName ?? 'Client',
          invoiceNumber: invoice?.invoiceNumber ?? '',
          dueDate: invoice?.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '',
          totalAmount: `R ${invoice?.total?.toFixed(2) ?? '0.00'}`,
          invoiceLink: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice?.id}`,
        },
      })
      .then(console.log, console.error);
    return NextResponse.json({ successMessage: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { errorMessage: 'Failed to send email reminder', error },
      { status: 400 },
    );
  }
}
