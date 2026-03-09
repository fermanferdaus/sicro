import { usePage } from '@inertiajs/react';

export default function Footer() {
    const { profil } = usePage<any>().props;

    return (
        <footer className="w-full bg-transparent px-6 py-6 text-center">
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground/60">
                <span>
                    &copy; 2026 {profil?.nama_store || 'Store'}. All Rights
                    Reserved
                </span>
            </div>
        </footer>
    );
}
