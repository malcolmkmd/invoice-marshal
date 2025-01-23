'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SubmissionResult, useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Invoice } from '@prisma/client';
import { CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Calendar } from '../../components/ui/calendar';
import { Label } from '../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { currencyFormatter } from '../utils/currencyFormatter';
import { standardDateTime } from '../utils/dateFormatter';
import { InvoiceItem, invoiceSchema } from '../utils/zodSchemas';
import { InvoiceCard } from './InvoiceCard';
import { SubmitButton } from './SubmitButton';

export interface iInvoiceFormProps {
  fromName: string;
  fromAddress: string;
  fromEmail: string;
  invoice?: Invoice;
  submitButton: string;
  formAction: (prevState: unknown, formData: FormData) => Promise<SubmissionResult<string[]>>;
}

export default function InvoiceForm(props: iInvoiceFormProps) {
  console.log('Invoice', props.invoice);
  const [lastResult, action] = useActionState(props.formAction, undefined);
  const { toast } = useToast();
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      // Parse the form data using Zod schema
      console.log('formData', formData);
      const result = parseWithZod(formData, { schema: invoiceSchema });
      console.log('result', result);
      // Check for validation errors
      if (result.status === 'error' && result.error instanceof z.ZodError) {
        // Display errors in a toast
        result.error.issues.forEach((issue) => {
          toast({
            title: 'Validation Error',
            description: `${issue.path.join('.')} - ${issue.message}`,
            variant: 'destructive', // Show error styling
          });
        });

        console.error('Validation Errors:', result.error.issues);
      }

      // Return the result to comply with `useForm` expectations
      return result;
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const [selectedDate, setSelectedDate] = useState(props.invoice?.date || new Date());

  // Update the items state to match the new schema
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: props.invoice?.invoiceItemDescription || '',
      quantity: Number(props.invoice?.invoiceItemQuantity) || 0,
      rate: Number(props.invoice?.invoiceItemRate) || 0,
    },
  ]);

  // Calculate total from all items
  const total = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.rate), 0);

  return (
    <InvoiceCard>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <div className='flex flex-col gap-2 w-fit mb-6'>
          <div className='flex items-center gap-4'>
            <Badge variant={props.invoice?.id ? 'default' : 'secondary'}>
              {props.invoice?.status}
            </Badge>
            {props.invoice?.id && (
              <Input
                type='hidden'
                name={fields.id.name}
                key={fields.id.key}
                value={props.invoice?.id || ''}
              />
            )}
          </div>
        </div>
        <div className='grid md:grid-cols-3 gap-6 mb-6'>
          {props.invoice?.invoiceNumber && (
            <>
              <div>
                <Label>Invoice No.</Label>
                <div className='flex'>
                  <span className='flex items-center px-3 border border-r-0 rounded-l-md bg-muted'>
                    #
                  </span>
                  <Input
                    disabled
                    defaultValue={props.invoice?.invoiceNumber ?? ''}
                    className='rounded-l-none'
                  />
                </div>
              </div>
              <div>
                <Label>Sent on.</Label>
                <div className='flex'>
                  <Input
                    disabled
                    defaultValue={standardDateTime(props.invoice?.createdAt)}
                    className='rounded'
                  />
                </div>
              </div>
              {props.invoice?.createdAt.toISOString() !==
                props.invoice?.updatedAt.toISOString() && (
                <div>
                  <Label>Updated on.</Label>
                  <div className='flex'>
                    <Input
                      disabled
                      defaultValue={standardDateTime(props.invoice?.updatedAt ?? new Date())}
                      className='rounded'
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <div>
            <Label>From</Label>
            <div className='space-y-2'>
              <Input
                name={fields.fromName.name}
                key={fields.fromName.initialValue}
                defaultValue={props.fromName}
                placeholder='Company Name'
              ></Input>
              <p className='text-sm text-red-500'>{fields.fromName.errors}</p>
              <Input
                name={fields.fromEmail.name}
                key={fields.fromEmail.initialValue}
                defaultValue={props.fromEmail}
                placeholder='Your Email'
              ></Input>
              <p className='text-sm text-red-500'>{fields.fromEmail.errors}</p>
              <Input
                name={fields.fromAddress.name}
                key={fields.fromAddress.initialValue}
                defaultValue={props.fromAddress}
                placeholder='Your Address'
              ></Input>
              <p className='text-sm text-red-500'>{fields.fromAddress.errors}</p>
            </div>
          </div>
          <div>
            <Label>To</Label>
            <div className='space-y-2'>
              <Input
                name={fields.clientName.name}
                key={fields.clientName.key}
                defaultValue={props.invoice?.clientName ?? fields.clientName.initialValue}
                placeholder='Client Name'
              ></Input>
              <p className='text-sm text-red-500'>{fields.clientName.errors}</p>
              <Input
                name={fields.clientEmail.name}
                key={fields.clientEmail.key}
                defaultValue={props.invoice?.clientEmail ?? fields.clientEmail.initialValue}
                placeholder='Client Email'
              ></Input>
              <p className='text-sm text-red-500'>{fields.clientEmail.errors}</p>
              <Input
                name={fields.clientAddress.name}
                key={fields.clientAddress.key}
                defaultValue={props.invoice?.clientAddress ?? fields.clientAddress.initialValue}
                placeholder='Client Address'
              ></Input>
              <p className='text-sm text-red-500'>{fields.clientAddress.errors}</p>
            </div>
          </div>
        </div>
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <div>
            <div>
              <Label>Date</Label>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline' className='w-[280px] text-left justify-start'>
                  <CalendarIcon className='size-4' />
                  {selectedDate ? <p>{selectedDate.toDateString()}</p> : <span>Due Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date || new Date())}
                  mode='single'
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
            <input
              type='hidden'
              name={fields.date.name}
              value={selectedDate ? selectedDate.toISOString() : ''}
            ></input>
            <p className='text-sm text-red-500'>{fields.date.errors}</p>
          </div>
          <div>
            <Label>Invoice Due</Label>
            <Select
              name={fields.dueDate.name}
              key={fields.dueDate.key}
              defaultValue={props.invoice?.dueDate.toString() ?? fields.dueDate.initialValue}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select due date' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='0'>Due on Reciept</SelectItem>
                <SelectItem value='15'>In 2 weeks</SelectItem>
                <SelectItem value='30'>In 1 month</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-sm text-red-500'>{fields.dueDate.errors}</p>
          </div>
        </div>
        <div>
          <div className='flex gap-4 mb-2 font-medium'>
            <div className='flex-1'>Description</div>
            <div className='w-32'>Quantity</div>
            <div className='w-32'>Price</div>
            <div className='w-32'>Amount</div>
            <div className='w-10'></div>
          </div>
          {items.map((item, index) => (
            <div key={index} className='flex gap-4 mb-4 items-center'>
              <div className='flex-1'>
                <Input
                  name={`items.${index}.description`}
                  value={item.description}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].description = e.target.value;
                    setItems(newItems);
                  }}
                  type='text'
                  placeholder='Item Name'
                />
              </div>
              <div className='w-32'>
                <Input
                  name={`items.${index}.quantity`}
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].quantity = Number(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  type='number'
                  placeholder='0'
                />
              </div>
              <div className='w-32'>
                <Input
                  name={`items.${index}.rate`}
                  value={item.rate}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].rate = Number(e.target.value) || 0;
                    setItems(newItems);
                  }}
                  type='number'
                  placeholder='0'
                />
              </div>
              <div className='w-32'>
                <Input
                  value={currencyFormatter(Number(item.quantity) * Number(item.rate))}
                  type='text'
                  placeholder={currencyFormatter(0)}
                  disabled
                />
              </div>
              <div className='w-10'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='text-red-500 hover:text-red-700'
                  onClick={() => {
                    if (items.length > 1) {
                      const newItems = items.filter((_, i) => i !== index);
                      setItems(newItems);
                    }
                  }}
                  disabled={items.length === 1}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M18 6L6 18' />
                    <path d='M6 6l12 12' />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            className='mb-4'
            onClick={() => {
              setItems([...items, { description: '', quantity: 0, rate: 0 }]);
            }}
          >
            Add Item
          </Button>
        </div>
        <div className='flex justify-end'>
          <div className='w-1/3'>
            <div className='flex justify-between py-2 border-t'>
              <span className='font-bold'>Total </span>
              <span>{currencyFormatter(total)}</span>
            </div>
          </div>
        </div>
        <div>
          <Label>Note</Label>
          <Textarea
            name={fields.note.name}
            key={fields.note.key}
            defaultValue={props.invoice?.note ?? fields.note.initialValue}
            placeholder='Notes...'
          />
        </div>
        <div className='flex items-center justify-end mt-6'>
          <SubmitButton text={props.submitButton} />
        </div>
      </form>
    </InvoiceCard>
  );
}
