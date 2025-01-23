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

async function getInvoiceData(userId: string): Promise<{
  openInvoices: {
    id: string;
    total: number;
  }[];
  paidInvoices: {
    id: string;
    total: number;
  }[];
}> {
  const [openInvoices, paidInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: 'SENT',
      },
      select: {
        id: true,
        total: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId: userId,
        status: 'PAID',
      },
      select: {
        id: true,
        total: true,
      },
    }),
  ]);
  return {
    openInvoices,
    paidInvoices,
  };
}

async function getInvoiceGraphData(userId: string): Promise<
  {
    date: string;
    amount: number;
  }[]
> {
  const rawData = await prisma.invoice.findMany({
    where: {
      userId: userId,
      status: 'PAID',
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const aggregatedData = rawData.reduce((acc: { [key: string]: number }, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString('en-US', {
      month: 'long',
    });
    acc[date] = (acc[date] || 0) + curr.total;
    return acc;
  }, {});

  const transformedData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(date + ', ' + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({ date, amount }));
  return transformedData;
}

async function getRecentInvoicesData(userId: string): Promise<
  {
    id: string;
    total: number;
    clientName: string;
    clientEmail: string;
  }[]
> {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      clientEmail: true,
      total: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 10,
  });
  return data;
}

export default async function DashboardRoute() {
  const session = await getSession();
  const data = await getData(session.user?.id as string);
  const invoiceData = await getInvoiceData(session.user?.id as string);
  const invoiceGraphData = await getInvoiceGraphData(session.user?.id as string);
  const recentInvoiceData = await getRecentInvoicesData(session.user?.id as string);
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
          <Blocks openInvoices={invoiceData.openInvoices} paidInvoices={invoiceData.paidInvoices} />
          <div className='grid gap-4 lg:grid-cols-3 md:gap-8'>
            <InvoiceGraph invoiceGraphData={invoiceGraphData} />
            <RecentInvoices recentInvoiceData={recentInvoiceData} />
          </div>
        </Suspense>
      )}
    </>
  );
}
