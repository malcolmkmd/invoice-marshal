'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { useActionState } from 'react';
import { onboardUser } from '../actions';
import { SubmitButton } from '../components/SubmitButton';
import { onboardingSchema } from '../utils/zodSchemas';

export default function Onboarding() {
  const [lastResult, action] = useActionState(onboardUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });
  return (
    <div className='min-h-screen w-screen flex items-center justify-center'>
      <Card className='max-w-sm mx-auto'>
        <CardHeader>
          <CardTitle className='text-xl'>Let&#39;s complete your profile!</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='grid gap-4'
            action={action}
            id={form.id}
            onSubmit={form.onSubmit}
            noValidate
          >
            <div className='grid gap-2'>
              <div className='grid gap-2'>
                <Label>Company Name</Label>
                <Input
                  name={fields.businessName.name}
                  key={fields.businessName.key}
                  defaultValue={fields.businessName.initialValue as string}
                  placeholder='John'
                />
                <p className='text-red-500 text-sm'>{fields.businessName.errors}</p>
              </div>
            </div>
            <div className='grid gap-2'>
              <Label>Address</Label>
              <Input
                name={fields.address.name}
                key={fields.address.key}
                defaultValue={fields.address.initialValue as string}
                placeholder='John street 123'
              />
              <p className='text-red-500 text-sm'>{fields.address.errors}</p>
            </div>
            <div className='grid gap-2'>
              <Label>Bank Name</Label>
              <Input
                name={fields.bankName.name}
                key={fields.bankName.key}
                defaultValue={fields.bankName.initialValue as string}
                placeholder='FNB'
              />
              <p className='text-red-500 text-sm'>{fields.bankName.errors}</p>
            </div>
            <div className='grid gap-2'>
              <Label>Bank Account Name</Label>
              <Input
                name={fields.bankAccountName.name}
                key={fields.bankAccountName.key}
                defaultValue={fields.bankAccountName.initialValue as string}
                placeholder='John Doe'
              />
              <p className='text-red-500 text-sm'>{fields.bankAccountName.errors}</p>
            </div>
            <div className='grid gap-2'>
              <Label>Account Number</Label>
              <Input
                name={fields.accountNumber.name}
                key={fields.accountNumber.key}
                defaultValue={fields.accountNumber.initialValue as string}
                placeholder='1234567890'
              />
              <p className='text-red-500 text-sm'>{fields.accountNumber.errors}</p>
            </div>
            <div className='grid gap-2'>
              <Label>Branch Code</Label>
              <Input
                name={fields.branchCode.name}
                key={fields.branchCode.key}
                defaultValue={fields.branchCode.initialValue as string}
                placeholder='250655'
              />
              <p className='text-red-500 text-sm'>{fields.branchCode.errors}</p>
            </div>
            <SubmitButton text='Finish onboarding' />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
