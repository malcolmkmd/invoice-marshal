import { Ban, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../../../components/ui/button';

interface iEmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export default function EmptyState(props: iEmptyStateProps) {
  return (
    <div className='flex flex-col flex-1 h-full items-center justify-center rounded-md border-2 border-dashed p-8 text-center animate-in fade-in-50'>
      <div className='flex items-center justify-center size-20 rounded-full bg-primary/10'>
        <Ban className='size-10 text-primary' />
      </div>
      <h2 className='mt-6 text-xl font-semibold'>{props.title}</h2>
      <p className='mb-8 mt-2 text-sm text-muted-foreground max-w-xm mx-auto text-center'>
        {props.description}
      </p>
      <Link href={props.href} className={buttonVariants()}>
        <PlusCircle className='size-4 mr-2' />
        {props.buttonText}
      </Link>
    </div>
  );
}
