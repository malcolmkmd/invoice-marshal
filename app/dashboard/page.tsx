import { Suspense } from 'react';
import { Skeleton } from '../../components/ui/skeleton';
import prisma from '../utils/db';
import { getSession } from '../utils/hooks';
import Blocks from './components/Blocks';
import EmptyState from './components/EmptyState';
import InvoiceGraph from './components/InvoiceGraph';
import RecentInvoices from './components/RecentInvoices';

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
    },
  });
  return data;
}

export default async function DashboardRoute() {
  const session = await getSession();
  const data = await getData(session.user?.id as string);
  return (
    <>
      {data.length < 1 ? (
        <EmptyState
          title='No invoices found'
          description='Create your first invoice to see them here...'
          buttonText='Create invoice'
          href='/dashboard/invoices/create'
        />
      ) : (
        <Suspense fallback={<Skeleton className='w-full h-full flex-1' />}>
          <Blocks />
          <div className='grid gap-4 lg:grid-cols-3 md:gap-8'>
            <InvoiceGraph />
            <RecentInvoices />
          </div>
        </Suspense>
      )}
    </>
  );
}
