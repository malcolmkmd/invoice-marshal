import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface InvoiceCardProps {
  children: ReactNode;
  className?: string;
}

export function InvoiceCard({ children, className }: InvoiceCardProps) {
  return (
    <Card className={`w-full max-w-4xl mx-auto ${className || ''}`}>
      <CardContent className='p-6'>{children}</CardContent>
    </Card>
  );
}
