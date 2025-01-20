import { ActivityIcon, CreditCardIcon, Users, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { currencyFormatter } from '../../utils/currencyFormatter';

export default function Blocks({
  openInvoices,
  paidInvoices,
}: {
  openInvoices: {
    id: string;
    total: number;
  }[];
  paidInvoices: {
    id: string;
    total: number;
  }[];
}) {
  const totalRevenue = paidInvoices.reduce((acc, invoice) => acc + invoice.total, 0);
  const outstandingRevenue = openInvoices.reduce((acc, invoice) => acc + invoice.total, 0);
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>Revenue</CardTitle>
          <Wallet className='size-8 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <h2 className='text-4xl font-bold text-green-500'>{currencyFormatter(totalRevenue)}</h2>
          <p className='text-xs text-muted-foreground'>Based on the last 30 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>Outstanding amount</CardTitle>
          <ActivityIcon className='size-8 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <h2 className={`text-4xl font-bold ${outstandingRevenue > 0 ? 'text-red-500' : ''}`}>
            {currencyFormatter(outstandingRevenue)}
          </h2>
          <p className='text-xs text-muted-foreground'>Invoices awaiting payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>Invoices issued</CardTitle>
          <Users className='size-8 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <h2 className='text-4xl font-bold'>
            {(paidInvoices.length + openInvoices.length).toString()}
          </h2>
          <p className='text-xs text-muted-foreground'>Total invoices issued</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-2xl'>Paid invoices</CardTitle>
          <CreditCardIcon className='size-8 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <h2 className='text-4xl font-bold'>
            {paidInvoices ? paidInvoices.length.toString() : '0'}
          </h2>
          <p className='text-xs text-muted-foreground'>Total paid invoices</p>
        </CardContent>
      </Card>
    </div>
  );
}
