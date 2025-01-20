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
import EmptyState from '../components/EmptyState';
import InvoiceActions from './InvoiceActions';

export function InvoiceList({ data }: { data: Invoice[] }) {
  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title='No invoices found'
          description='Create an invoice'
          buttonText='Create invoice'
          href='/dashboard/invoices/create'
        />
      ) : (
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
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{standardDateTime(new Date(invoice.createdAt))}</TableCell>
                <TableCell>{standardDateTime(new Date(invoice.updatedAt))}</TableCell>
                <TableCell className='text-right'>
                  <InvoiceActions invoiceId={invoice.id} status={invoice.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
