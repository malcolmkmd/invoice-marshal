import { Invoice } from '@prisma/client';
import { editInvoice } from '../../../actions';
import InvoiceForm from '../../../components/InvoiceForm';

export default function EditInvoice(props: {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  invoice: Invoice;
}) {
  return (
    <InvoiceForm {...props} submitButton='Edit Invoice' formAction={editInvoice}></InvoiceForm>
  );
}
