import { createInvoice } from '../../../actions';
import InvoiceForm from '../../../components/InvoiceForm';

export default function CreateInvoice(props: {
  businessName?: string;
  address?: string;
  email?: string;
}) {
  const mappedProps = {
    fromName: props.businessName ?? '',
    fromEmail: props.email ?? '',
    fromAddress: props.address ?? '',
  };

  return (
    <InvoiceForm
      {...mappedProps}
      submitButton='Create Invoice'
      formAction={createInvoice}
    ></InvoiceForm>
  );
}
