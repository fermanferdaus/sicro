import { PropsWithChildren, useEffect, useState, useRef } from 'react';
import Sidebar from '@/Components/Layout/Sidebar';
import Topbar from '@/Components/Layout/Topbar';
import Footer from '@/Components/Layout/Footer';
import Loading from '@/Components/Core/Loading';
import { useToast } from '@/Components/Core/Toast';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface MainLayoutProps extends PropsWithChildren {
    onSearch?: (value: string) => void;
    searchValue?: string;
    noPadding?: boolean;
    hideFooter?: boolean;
}

export default function MainLayout({
    children,
    onSearch,
    searchValue,
    noPadding = false,
    hideFooter = false,
}: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        // Check localStorage for saved state
        const saved = localStorage.getItem('sidebarOpen');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Default to false on mobile (md < 768px), true on desktop
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const { showToast } = useToast();
    const { flash } = usePage<any>().props;
    const previousFlash = useRef<any>(null);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    // Handle responsive sidebar behavior on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                // On mobile, auto-close if previously open
                setIsSidebarOpen(false);
            } else {
                // On desktop, auto-open if it was closed by resize
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Prevent duplicate toasts (e.g., from React Strict Mode or re-renders)
        const isSameSuccess = flash?.success === previousFlash.current?.success;
        const isSameError = flash?.error === previousFlash.current?.error;

        if (flash?.success && !isSameSuccess) {
            showToast(flash.success, 'success');
        }
        if (flash?.error && !isSameError) {
            showToast(flash.error, 'error');
        }

        previousFlash.current = flash;
    }, [flash, showToast]);

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Loading isGlobal />
            {/* Sidebar Overlay Backdrop (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div
                className={cn(
                    'relative flex h-full flex-1 flex-col overflow-hidden transition-all duration-300',
                    isSidebarOpen ? 'md:ml-60' : 'md:ml-20',
                    'ml-0', // Default no margin on mobile
                )}
            >
                {/* Topbar */}
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onSearch={onSearch}
                    searchValue={searchValue}
                />

                {/* Page Content */}
                <main
                    className={cn(
                        'flex-1 text-slate-900',
                        noPadding
                            ? 'flex flex-col'
                            : 'overflow-y-auto p-6 pt-0',
                    )}
                >
                    {children}
                </main>

                {/* Footer */}
                {!hideFooter && <Footer />}
            </div>
        </div>
    );
}
