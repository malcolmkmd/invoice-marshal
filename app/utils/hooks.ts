import { redirect } from 'next/navigation';
import { auth } from './auth';

export async function getSession() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  return session;
}
