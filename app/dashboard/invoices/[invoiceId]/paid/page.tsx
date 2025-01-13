import PaidGif from '@/public/paid-gif.gif';
import Image from 'next/image';
import Link from 'next/link';
import { buttonVariants } from '../../../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../../components/ui/card';
import { Authorize, MarkAsPaid } from '../../../../actions';
import { SubmitButton } from '../../../../components/SubmitButton';
import { getSession } from '../../../../utils/hooks';

type Params = Promise<{ invoiceId: string }>;

export default async function MarkAsPaidRoute({ params }: { params: Params }) {
  const session = await getSession();
  const { invoiceId } = await params;
  await Authorize(invoiceId, session.user?.id as string);
  return (
    <div className='flex flex-1 justify-center items-center'>
      <Card className='max-w[500px]'>
        <CardHeader>
          <CardTitle>Mark as Paid</CardTitle>
          <CardDescription>Are you sure you want to mark this invoice as paid?</CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={PaidGif} alt='Paid Gif' className='rounded-lg' />
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <Link className={buttonVariants({ variant: 'secondary' })} href='/dashboard/invoices'>
            Cancel
          </Link>
          <form
            action={async () => {
              'use server';
              await MarkAsPaid(invoiceId);
            }}
          >
            <SubmitButton text='Mark as Paid' />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
