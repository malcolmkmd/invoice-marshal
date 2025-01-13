import WarningGif from '@/public/warning-gif.gif';
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
import { Authorize, DeleteInvoice } from '../../../../actions';
import { SubmitButton } from '../../../../components/SubmitButton';
import { getSession } from '../../../../utils/hooks';

type Params = Promise<{ invoiceId: string }>;

export default async function DeleteInvoiceRoute({ params }: { params: Params }) {
  const session = await getSession();
  const { invoiceId } = await params;
  await Authorize(invoiceId, session.user?.id as string);
  return (
    <div className='flex flex-1 justify-center items-center'>
      <Card className='max-w[500px]'>
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>Are you sure you want to delete this invoice?</CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={WarningGif} alt='Warning Gif' className='rounded-lg' />
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <Link className={buttonVariants({ variant: 'secondary' })} href='/dashboard/invoices'>
            Cancel
          </Link>
          <form
            action={async () => {
              'use server';
              await DeleteInvoice(invoiceId);
            }}
          >
            <SubmitButton text='Delete Invoice' variant={'destructive'} />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
