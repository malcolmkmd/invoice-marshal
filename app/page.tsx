import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';
import { SubmitButton } from './components/SubmitButton';
import { auth, signIn } from './utils/auth';

export default async function Login() {
  const handleSignIn = async (formData: FormData) => {
    'use server';
    await signIn('nodemailer', formData);
  };

  const session = await auth();
  if (session?.user) {
    redirect('/dashboard/invoices');
  }

  return (
    <>
      <div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'>
        <div className='absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_300px,#C9EBFF,transparent)]'></div>
      </div>
      <div className='flex h-screen w-full items-center justify-center px-4'>
        <Card className='max-w-sm'>
          <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSignIn} className='flex flex-col gap-y-4'>
              <div className='flex flex-col gap-y-2'>
                <Label>Email</Label>
                <Input name='email' type='email' required placeholder='hello@email.com' />
              </div>
              <SubmitButton text='Login' />
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
