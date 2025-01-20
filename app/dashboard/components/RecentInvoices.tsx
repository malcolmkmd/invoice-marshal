import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { currencyFormatter } from '../../utils/currencyFormatter';

interface iRecentInvoicesProps {
  recentInvoiceData: {
    id: string;
    total: number;
    clientName: string;
    clientEmail: string;
  }[];
}

export default function RecentInvoices({ recentInvoiceData }: iRecentInvoicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {recentInvoiceData.map((invoice) => (
          <div key={invoice.id} className='flex items-center gap-4 pb-4'>
            <Avatar className='hidden sm:flex size-9'>
              <AvatarFallback>{invoice.clientName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-medium leading-none'>{invoice.clientName}</p>
              <p className='text-sm text-muted-foreground'>{invoice.clientEmail}</p>
            </div>
            <div className='ml-auto font-semibold'>{currencyFormatter(invoice.total)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
