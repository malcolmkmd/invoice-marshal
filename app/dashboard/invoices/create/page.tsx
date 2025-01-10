import prisma from '../../../utils/db';
import { getSession } from '../../../utils/hooks';
import CreateInvoice from './CreateInvoice';

async function getUserData(
  userId: string,
): Promise<{ businessName: string; address?: string; email: string }> {
  // Query the user data
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      firstName: true,
      lastName: true,
      businessName: true,
      address: true,
      email: true,
    },
  });

  // Handle the case where data is null or businessName is missing
  if (!data) {
    throw new Error('User not found');
  }

  const { firstName, lastName, businessName, address, email } = data;

  return {
    businessName: businessName?.trim() || `${firstName} ${lastName}`,
    address: address ?? undefined,
    email,
  };
}

export default async function InvoiceCreationRoute() {
  const session = await getSession();
  const data = await getUserData(session.user?.id as string);
  return <CreateInvoice {...data} />;
}
