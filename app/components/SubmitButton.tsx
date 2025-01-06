'use client';

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
}

export function SubmitButton({ text }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button disabled className='w-full'>
          <Loader2 className='size-4 mr-2 animate-spin' />
          Please wait..
        </Button>
      ) : (
        <Button type='submit' className='w-full'>
          {text}
        </Button>
      )}
    </div>
  );
}
