import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  DownloadCloudIcon,
  MailIcon,
  MoreHorizontal,
  PencilIcon,
  Trash,
} from 'lucide-react';
import Link from 'next/link';

export default function InvoiceActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='secondary'>
          <MoreHorizontal className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href=''>
            <PencilIcon className='size-4 mr-2' />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href=''>
            <DownloadCloudIcon className='size-4 mr-2' />
            Download
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href=''>
            <MailIcon className='size-4 mr-2' />
            Send reminder
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href=''>
            <Trash className='size-4 mr-2' />
            Delete
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href=''>
            <CheckCircle className='size-4 mr-2' />
            Mark as Paid
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
