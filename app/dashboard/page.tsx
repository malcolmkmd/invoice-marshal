import { signOut } from '../utils/auth';
import { requireUser } from '../utils/hooks';

export default async function DashboardRoute() {
  await requireUser();

  const handleSignOut = async () => {
    'use server';
    await signOut();
  };
  return (
    <div>
      <form action={handleSignOut}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
}
