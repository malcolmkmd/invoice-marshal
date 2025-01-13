'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WarningGif from '@/public/warning-gif.gif';
import {
  CheckCircle,
  DownloadCloudIcon,
  MailIcon,
  MoreHorizontal,
  PencilIcon,
  Trash,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { DeleteInvoice } from '../../actions';
import { SubmitButton } from '../../components/SubmitButton';

interface iInvoiceActionProps {
  invoiceId: string;
  status: string;
}

export default function InvoiceActions({ invoiceId, status }: iInvoiceActionProps) {
  const handleSendReminder = () => {
    toast.promise(
      fetch(`/api/email/${invoiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'applicatin/json',
        },
      }),
      {
        loading: 'Sending reminder email....',
        success: 'Reminder email sent',
        error: 'Failed to send reminder email',
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='secondary'>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/invoices/${invoiceId}`}>
            <PencilIcon className='size-4 mr-2' />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendReminder}>
          <MailIcon className='size-4 mr-2' />
          Send reminder
        </DropdownMenuItem>
        {status !== 'PAID' && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${invoiceId}/paid`}>
              <CheckCircle className='size-4 mr-2' />
              Mark as Paid
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href=''>
            <DownloadCloudIcon className='size-4 mr-2' />
            Download
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='#' onClick={(e) => e.preventDefault()}>
            <Dialog>
              <DialogTrigger asChild>
                <div className='flex items-center w-full'>
                  <Trash className='size-4 mr-2' />
                  Delete Invoice
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Invoice</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this invoice?
                  </DialogDescription>
                </DialogHeader>
                <div className='my-4'>
                  <Image src={WarningGif} alt='Warning Gif' className='rounded-lg' />
                </div>
                <div className='flex items-center justify-between'>
                  <DialogClose asChild>
                    <Button type='button' variant='secondary'>
                      Close
                    </Button>
                  </DialogClose>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await DeleteInvoice(invoiceId);
                    }}
                  >
                    <SubmitButton text='Delete Invoice' variant='destructive' />
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
