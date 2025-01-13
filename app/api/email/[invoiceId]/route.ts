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
        template_uuid: 'b977b054-8302-4464-9465-c7363b3c7af1',
        template_variables: {
          company_info_name: 'Kumwenda Attorneys Inc.',
          first_name: invoice?.clientName ?? 'Client',
          company_info_address: 'The Atlanta Lifestyle Estate',
          company_info_city: 'Centurion',
          company_info_zip_code: '0157',
          company_info_country: 'South Africa',
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
