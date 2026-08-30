import { usePage, router, Link } from '@inertiajs/react';
import { Search, LogOut, User, X, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TopbarProps {
    isSidebarOpen?: boolean;
    setIsSidebarOpen?: (isOpen: boolean) => void;
    onSearch?: (value: string) => void;
    searchValue?: string;
}

export default function Topbar({
    isSidebarOpen = true,
    setIsSidebarOpen,
    onSearch,
    searchValue = '',
}: TopbarProps) {
    const { auth } = usePage<any>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Global Search Logic
    const [localSearch, setLocalSearch] = useState(searchValue || '');
    const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setLocalSearch(searchValue || '');
    }, [searchValue]);

    const handleSearch = (value: string) => {
        setLocalSearch(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (onSearch) {
                onSearch(value);
                setShowUnavailableMessage(false);
            } else {
                // If onSearch is not provided, this page doesn't support searching
                if (value.trim()) {
                    setShowUnavailableMessage(true);
                } else {
                    setShowUnavailableMessage(false);
                }
            }
        }, 500); // 500ms debounce
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between bg-slate-50/50 px-6 backdrop-blur-3xl transition-all duration-300 print:hidden">
            <div className="flex items-center gap-4">
                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 md:hidden"
                >
                    <Menu className="h-6 w-6 text-slate-600" />
                </button>

                {/* Search Bar */}
                <div className="relative w-40 sm:w-72 lg:w-96">
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari data..."
                        className="w-full rounded-full bg-slate-100 py-2 pr-10 pl-10 text-sm transition-shadow outline-none focus:ring-2 focus:ring-[#ef5350]/50"
                        value={localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {localSearch && (
                        <button
                            onClick={() => handleSearch('')}
                            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}

                    {/* Unavailable Message Overlay */}
                    {showUnavailableMessage && (
                        <div className="absolute top-full left-0 mt-2 w-full rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                            <div className="text-center text-sm font-medium text-slate-500">
                                Fitur pencarian tidak tersedia di halaman ini.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile */}
            <div className="relative z-50" ref={menuRef}>
                <div
                    className="flex cursor-pointer items-center gap-4 rounded-xl p-1.5 transition-colors hover:bg-slate-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="hidden text-right md:block">
                        <p className="text-sm font-bold text-slate-800">
                            HI, {auth?.user?.nama_lengkap || 'KASIR'}
                        </p>
                        <p className="text-xs text-slate-500">
                            {auth?.user?.role || 'Staff'}
                        </p>
                    </div>
                    <div className="relative">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-transform active:scale-90 ${
                                auth?.user?.foto_profile
                                    ? 'bg-transparent'
                                    : 'bg-[#ef5350] text-white'
                            }`}
                        >
                            {auth.user.foto_profile ? (
                                <img
                                    src={auth.user.foto_profile}
                                    alt={auth.user.nama_lengkap}
                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ef5350] text-sm font-bold text-white select-none">
                                    {getInitials(auth.user.nama_lengkap)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 transform animate-in overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl transition-all duration-300 fade-in slide-in-from-top-2">
                        <div className="bg-slate-50 p-4">
                            <p className="text-sm font-bold text-slate-900">
                                {auth?.user?.nama_lengkap}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {auth?.user?.email}
                            </p>
                        </div>
                        <div className="p-2">
                            <Link
                                href={route('setting.index')}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                            >
                                <User className="h-4 w-4" />
                                Profil Saya
                            </Link>
                            <div className="my-1 border-t border-slate-100"></div>
                            <button
                                onClick={handleLogout}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 focus:outline-none"
                            >
                                <LogOut className="h-4 w-4" />
                                Keluar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
