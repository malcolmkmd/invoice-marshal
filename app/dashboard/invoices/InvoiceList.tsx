import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Invoice } from '@prisma/client';
import { Badge } from '../../../components/ui/badge';
import { currencyFormatter } from '../../utils/currencyFormatter';
import { standardDateTime } from '../../utils/dateFormatter';
import prisma from '../../utils/db';
import { getSession } from '../../utils/hooks';
import InvoiceActions from './InvoiceActions';

async function getData(userId: string): Promise<Invoice[]> {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // By returning Invoice[], each invoice in `data.map(...)` has correct types
  return data;
}

export default async function InvoiceList() {
  const session = await getSession();
  const data = await getData(session.user?.id as string);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created on.</TableHead>
          <TableHead>Updated on.</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>{currencyFormatter(invoice.total)}</TableCell>
            <TableCell>
              <Badge
                className={
                  invoice.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{standardDateTime(new Date(invoice.createdAt))}</TableCell>
            <TableCell>{standardDateTime(new Date(invoice.updatedAt))}</TableCell>
            <TableCell className='text-right'>
              <InvoiceActions invoiceId={invoice.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
