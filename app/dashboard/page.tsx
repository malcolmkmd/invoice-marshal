import React from 'react'
import { requireUser } from '../utils/hooks';
import { signOut } from '../utils/auth';

export default async function DashboardRoute() {
    const session = await requireUser();
    return (
        <div>
            <form
                action={async () => {
                    "use server"
                    await signOut()
                }}
            >
                <button type="submit">Sign Out</button>
            </form>
        </div>
    )
}
