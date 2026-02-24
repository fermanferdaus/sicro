import { usePage } from '@inertiajs/react';

export default function useAuth() {
    const { auth } = usePage<any>().props;

    const user = auth?.user;

    const hasRole = (role: string) => {
        return user?.role === role;
    };

    return {
        user,
        isOwner: hasRole('owner'),
        isKasir: hasRole('kasir'),
        hasRole,
    };
}
