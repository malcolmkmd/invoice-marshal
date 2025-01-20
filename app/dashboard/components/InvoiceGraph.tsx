import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import prisma from '../../utils/db';
import { getSession } from '../../utils/hooks';
import Graph from './Graph';

async function getInvoices(userId: string) {
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

export default async function InvoiceGraph() {
  const session = await getSession();
  const invoiceGraphData = await getInvoices(session.user?.id as string);
  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>Invoices which have been paid in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={invoiceGraphData} />
      </CardContent>
    </Card>
  );
}
