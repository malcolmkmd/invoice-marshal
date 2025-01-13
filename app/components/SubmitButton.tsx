'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
  variant?:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button disabled className='w-full' variant={variant}>
          <Loader2 className='size-4 mr-2 animate-spin' />
          Please wait..
        </Button>
      ) : (
        <Button type='submit' className='w-full' variant={variant}>
          {text}
        </Button>
      )}
    </div>
  );
}
