'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { Button } from '../../../../components/ui/button';
import { Calendar } from '../../../../components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { Textarea } from '../../../../components/ui/textarea';
import { SubmitButton } from '../../../components/SubmitButton';
import { createInvoice } from '../../../actions';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { invoiceSchema } from '../../../utils/zodSchemas';
import { formatCurrency, SupportedCurrency } from '../../../utils/formatCurrency';

export default function CreateInvoice() {
  const [lastResult, action] = useActionState(createInvoice, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: invoiceSchema });
      console.log('Validation Result:', result);
      return result;
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('ZAR');

  const calculatedTotal = (Number(quantity) || 0) * (Number(rate) || 0);

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardContent className='p-6'>
        <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
          <div className='flex flex-col gap-2 w-fit mb-6'>
            <div className='flex items-center gap-4'>
              <Badge variant='secondary'>Draft</Badge>
              <Input
                name={fields.invoiceName.name}
                key={fields.invoiceName.key}
                defaultValue={fields.invoiceName.initialValue}
                placeholder='Test 123'
              ></Input>
            </div>
            <p className='text-red-500 text-sm'>{fields.invoiceName.errors}</p>
          </div>
          <div className='grid md:grid-cols-3 gap-6 mb-6'>
            <div>
              <Label>Invoice No.</Label>
              <div className='flex'>
                <span className='flex items-center px-3 border border-r-0 rounded-l-md bg-muted'>
                  #
                </span>
                <Input
                  name={fields.invoiceNumber.name}
                  key={fields.invoiceNumber.initialValue}
                  defaultValue={fields.invoiceNumber.initialValue}
                  className='rounded-l-none'
                  placeholder='123'
                ></Input>
              </div>
              <p className='text-red-500 text-sm'>{fields.invoiceNumber.errors}</p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                name={fields.currency.name}
                key={fields.currency.key}
                defaultValue='ZAR'
                onValueChange={(value) => setCurrency(value as SupportedCurrency)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Currency'></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='ZAR'>ZAR</SelectItem>
                  <SelectItem value='USD'>USD</SelectItem>
                  <SelectItem value='EUR'>Euros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <div>
              <Label>From</Label>
              <div className='space-y-2'>
                <Input
                  name={fields.fromName.name}
                  key={fields.fromName.initialValue}
                  defaultValue={fields.fromName.initialValue}
                  placeholder='Company Name'
                ></Input>
                <p className='text-sm text-red-500'>{fields.fromName.errors}</p>
                <Input
                  name={fields.fromEmail.name}
                  key={fields.fromEmail.initialValue}
                  defaultValue={fields.fromEmail.initialValue}
                  placeholder='Your Email'
                ></Input>
                <p className='text-sm text-red-500'>{fields.fromEmail.errors}</p>
                <Input
                  name={fields.fromAddress.name}
                  key={fields.fromAddress.initialValue}
                  defaultValue={fields.fromAddress.initialValue}
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
                  defaultValue={fields.clientName.initialValue}
                  placeholder='Client Name'
                ></Input>
                <p className='text-sm text-red-500'>{fields.clientName.errors}</p>
                <Input
                  name={fields.clientEmail.name}
                  key={fields.clientEmail.key}
                  defaultValue={fields.clientEmail.initialValue}
                  placeholder='Client Email'
                ></Input>
                <p className='text-sm text-red-500'>{fields.clientEmail.errors}</p>
                <Input
                  name={fields.clientAddress.name}
                  key={fields.clientAddress.key}
                  defaultValue={fields.clientAddress.initialValue}
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
                defaultValue={fields.dueDate.initialValue}
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
            <div className='grid grid-cols-12 gap-4 mb-2 font-medium'>
              <p className='col-span-6'>Description</p>
              <p className='col-span-2'>Quantity</p>
              <p className='col-span-2'>Price</p>
              <p className='col-span-2'>Amount</p>
            </div>
            <div className='grid grid-cols-12 gap-4 mb-4'>
              <div className='col-span-6'>
                <Input
                  name={fields.invoiceItemDescription.name}
                  key={fields.invoiceItemDescription.key}
                  defaultValue={fields.invoiceItemDescription.initialValue}
                  type='text'
                  placeholder='Item Name'
                ></Input>
              </div>
              <div className='col-span-2'>
                <Input
                  name={fields.invoiceItemQuantity.name}
                  key={fields.invoiceItemQuantity.key}
                  defaultValue={fields.invoiceItemQuantity.initialValue}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type='number'
                  placeholder='0'
                ></Input>
              </div>
              <div className='col-span-2'>
                <Input
                  name={fields.invoiceItemRate.name}
                  key={fields.invoiceItemRate.key}
                  defaultValue={fields.invoiceItemRate.initialValue}
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  type='number'
                  placeholder='0'
                ></Input>
              </div>
              <div className='col-span-2'>
                <Input
                  value={formatCurrency({ amount: calculatedTotal, currency })}
                  type='text'
                  placeholder={formatCurrency({ amount: 0, currency })}
                  disabled
                ></Input>
                <input
                  type='hidden'
                  name={fields.total.name}
                  key={fields.total.key}
                  value={calculatedTotal}
                />
              </div>
            </div>
          </div>
          <div className='flex justify-end'>
            <div className='w-1/3'>
              <div className='flex justify-between py-2 border-t'>
                <span className='font-bold'>Total ({currency})</span>
                <span>{formatCurrency({ amount: calculatedTotal, currency })}</span>
              </div>
            </div>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea
              name={fields.note.name}
              key={fields.note.key}
              defaultValue={fields.note.errors}
              placeholder='Notes...'
            />
          </div>
          <div className='flex items-center justify-end mt-6'>
            <SubmitButton text='Send Invoice' />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
