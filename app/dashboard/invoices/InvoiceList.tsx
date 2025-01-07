import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import InvoiceActions from './InvoiceActions';
import { getSession as getSession } from '../../utils/hooks';
import { currencyFormatter, SupportedCurrency } from '../../utils/currencyFormatter';
import { dateFormatter } from '../../utils/dateFormatter';
import { Badge } from '../../../components/ui/badge';

interface iInvoice {
  id: string;
  clientName: string;
  total: number;
  status: string;
  createdAt: string;
  invoiceNumber: string;
  currency: string;
}

async function getData(userId: string): Promise<iInvoice[]> {
  const data = await prisma.invoice.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      clientName: true,
      total: true,
      status: true,
      createdAt: true,
      invoiceNumber: true,
      currency: true,
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
          <TableHead>Date</TableHead>
          <TableHead className='text-right'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {currencyFormatter({
                amount: invoice.total,
                currency: invoice.currency as SupportedCurrency,
              })}
            </TableCell>
            <TableCell>
              <Badge
                className={
                  invoice.status === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{dateFormatter(new Date(invoice.createdAt))}</TableCell>
            <TableCell className='text-right'>
              <InvoiceActions />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
