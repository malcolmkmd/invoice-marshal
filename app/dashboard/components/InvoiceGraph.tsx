import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import Graph from './Graph';

interface iInvoiceGraphProps {
  invoiceGraphData: { date: string; amount: number }[];
}

export default function InvoiceGraph({ invoiceGraphData }: iInvoiceGraphProps) {
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
