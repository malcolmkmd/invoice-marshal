import CreateInvoice from './CreateInvoice';
import prisma from '../../../utils/db';
import { getSession } from '../../../utils/hooks';

async function getUserData(
  userId: string,
): Promise<{ firstName: string; lastName: string; address: string; email: string }> {
  // Ensure the function returns the query result
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });

  // TypeScript expects a return statement
  return data as { firstName: string; lastName: string; address: string; email: string };
}

export default async function InvoiceCreationRoute() {
  const session = await getSession();
  const data = await getUserData(session.user?.id as string);
  return <CreateInvoice {...data} />;
}
