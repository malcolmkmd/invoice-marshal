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
  BellIcon,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { DeleteInvoice, sendInvoice } from '../../actions';

interface iInvoiceActionProps {
  invoiceId: string;
  status: string;
  dueDate: Date;
  reminderSent: boolean;
}

export default function InvoiceActions({
  invoiceId,
  status,
  dueDate,
  reminderSent,
}: iInvoiceActionProps) {
  const handleSendInvoice = () => {
    toast.promise(sendInvoice(invoiceId), {
      loading: 'Emailing invoice...',
      success: 'Invoice sent successfully',
      error: 'Failed to send invoice',
    });
  };

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

  const isPastDue = new Date() > new Date(dueDate);

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
        <DropdownMenuItem asChild>
          <Link href={`/api/invoice/${invoiceId}`}>
            <DownloadCloudIcon className='size-4 mr-2' />
            Download
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendInvoice}>
          <MailIcon className='size-4 mr-2' />
          Email invoice
        </DropdownMenuItem>
        {isPastDue && !reminderSent && (
          <DropdownMenuItem onClick={handleSendReminder}>
            <BellIcon className='size-4 mr-2' />
            Send reminder
          </DropdownMenuItem>
        )}
        {status !== 'PAID' && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/invoices/${invoiceId}/paid`}>
              <CheckCircle className='size-4 mr-2' />
              Mark as Paid
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href='#' onClick={(e) => e.preventDefault()}>
            <Dialog>
              <DialogTrigger asChild>
                <div className='flex items-center w-full'>
                  <Trash className='size-4 mr-2' />
                  Delete Invoice
                </div>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                  <DialogTitle>Delete Invoice</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this invoice?
                  </DialogDescription>
                </DialogHeader>
                <div className='my-4'>
                  <Image src={WarningGif} alt='Warning Gif' className='rounded-lg' />
                </div>
                <DialogFooter className='sm:justify-start'>
                  <div className='flex items-center gap-2'>
                    <DialogClose asChild>
                      <Button
                        variant='destructive'
                        onClick={async () => {
                          await DeleteInvoice(invoiceId);
                        }}
                      >
                        Delete Invoice
                      </Button>
                    </DialogClose>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
