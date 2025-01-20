import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@prisma/client';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '../../../components/ui/skeleton';
import prisma from '../../utils/db';
import { getSession } from '../../utils/hooks';
import { InvoiceList } from './InvoiceList';

async function getData(userId: string): Promise<Invoice[]> {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return data;
}

export default async function InvoicesRoute() {
  const session = await getSession();
  const data = await getData(session.user?.id as string);
  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-2xl font-bold'>Invoices</CardTitle>
            <CardDescription>Manage your invoices here</CardDescription>
          </div>
          <Link href='/dashboard/invoices/create' className={buttonVariants()}>
            <PlusIcon /> Create Invoice
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className='w-full h-[500px]' />}>
          <InvoiceList data={data} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
