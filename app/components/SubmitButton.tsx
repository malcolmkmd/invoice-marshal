'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className='size-4 mr-2 animate-spin' />
          Please wait..
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          Submit
        </Button>
      )}
    </div>
  );
}
