import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Package,
    Settings,
    Menu,
    ShoppingCart,
    History,
    ChartPie,
    Banknote,
    Users,
    ShieldCheck,
    Gift,
    Wallet,
    Store,
} from 'lucide-react';
import useAuth from '@/Hooks/useAuth';

interface SidebarProps {
    className?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
    className,
    isOpen,
    setIsOpen,
}: SidebarProps) {
    const { profil } = usePage<any>().props;
    const { isOwner } = useAuth();
    const { url } = usePage();
    const menuGroups = [
        {
            label: 'Utama',
            items: [
                {
                    icon: LayoutDashboard,
                    label: 'Dashboard',
                    href: '/dashboard',
                    active: url.startsWith('/dashboard'),
                },
            ],
        },
        {
            label: 'Master Data',
            items: [
                {
                    icon: Package,
                    label: 'Produk',
                    href: '/produk',
                    active: url.startsWith('/produk'),
                },
                ...(isOwner
                    ? [
                          {
                              icon: Users,
                              label: 'Pegawai',
                              href: '/pegawai',
                              active: url.startsWith('/pegawai'),
                          },
                      ]
                    : []),
            ],
        },
        {
            label: 'Operasional',
            items: [
                {
                    icon: ShoppingCart,
                    label: 'Transaksi',
                    href: '/transaksi',
                    active:
                        url.startsWith('/transaksi') &&
                        !url.startsWith('/riwayat-transaksi'),
                },
                {
                    icon: History,
                    label: 'Riwayat',
                    href: '/riwayat-transaksi',
                    active: url.startsWith('/riwayat-transaksi'),
                },
            ],
        },
        ...(isOwner
            ? [
                  {
                      label: 'Keuangan',
                      items: [
                          {
                              icon: Wallet,
                              label: 'Pengeluaran',
                              href: '/pengeluaran',
                              active: url.startsWith('/pengeluaran'),
                          },
                          {
                              icon: Banknote,
                              label: 'Gaji Pegawai',
                              href: '/gaji',
                              active: url.startsWith('/gaji'),
                          },
                          {
                              icon: Gift,
                              label: 'Bonus Pegawai',
                              href: '/bonus',
                              active: url.startsWith('/bonus'),
                          },
                      ],
                  },
              ]
            : []),
        {
            label: 'Laporan',
            items: [
                {
                    icon: ChartPie,
                    label: 'Analisis Laporan',
                    href: '/laporan',
                    active: url.startsWith('/laporan'),
                },
            ],
        },
        {
            label: 'Pengaturan',
            items: [
                ...(isOwner
                    ? [
                          {
                              icon: ShieldCheck,
                              label: 'Akun Pengguna',
                              href: '/account',
                              active: url.startsWith('/account'),
                          },
                      ]
                    : []),
                ...(isOwner
                    ? [
                          {
                              icon: Store,
                              label: 'Profil Toko',
                              href: '/profil',
                              active: url.startsWith('/profil'),
                          },
                      ]
                    : []),
                {
                    icon: Settings,
                    label: 'Pengaturan Akun',
                    href: '/setting',
                    active: url.startsWith('/setting'),
                },
            ],
        },
    ];

    return (
        <aside
            className={cn(
                'no-scrollbar fixed top-0 left-0 z-40 h-screen overflow-y-auto bg-slate-50/50 backdrop-blur-xl transition-all duration-300 ease-in-out print:hidden',
                isOpen
                    ? 'w-64 translate-x-0'
                    : '-translate-x-full md:w-20 md:translate-x-0',
                isOpen && 'md:w-60',
                className,
            )}
        >
            <div
                className={cn(
                    'flex items-center py-4',
                    isOpen ? 'justify-between px-6' : 'justify-center px-0',
                )}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="group relative flex h-12 w-12 items-center justify-center rounded-lg hover:bg-slate-100"
                    >
                        {/* Logo - visible by default, hidden on hover */}
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
                            {profil?.logo_url ? (
                                <img
                                    src={profil.logo_url}
                                    alt="Logo"
                                    className="h-12 w-12 object-contain"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-[#ef5350]">
                                    S
                                </div>
                            )}
                        </div>

                        {/* Menu Icon - hidden by default, visible on hover */}
                        <Menu className="absolute h-6 w-6 text-slate-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </button>

                    {isOpen && (
                        <div className="flex h-12 flex-col justify-center">
                            <span className="text-l truncate leading-tight font-black tracking-tight text-[#ef5350]">
                                SICRO
                            </span>
                            <span className="truncate text-xs font-medium text-slate-400">
                                {profil?.nama_store || 'STORE'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <nav
                className={cn(
                    '-mt-3 flex flex-col',
                    isOpen ? 'gap-3 px-6 py-3' : 'items-center gap-2 p-2',
                )}
            >
                {menuGroups.map((group, groupIndex) => (
                    <div
                        key={groupIndex}
                        className={cn(
                            'flex flex-col',
                            isOpen ? 'gap-1' : 'gap-2',
                        )}
                    >
                        {isOpen && group.label && (
                            <h3 className="mt-4 mb-2 px-3 text-xs font-bold tracking-wider text-slate-400 uppercase first:mt-0">
                                {group.label}
                            </h3>
                        )}
                        {group.items.map((item, itemIndex) => (
                            <Link
                                key={itemIndex}
                                href={item.href}
                                onClick={() => {
                                    // Close sidebar on mobile when navigating
                                    if (window.innerWidth < 768) {
                                        setIsOpen(false);
                                    }
                                }}
                                className={cn(
                                    'flex items-center gap-2 rounded-lg py-2 text-sm transition-colors',
                                    isOpen ? 'px-3' : 'justify-center px-0',
                                    item.active
                                        ? 'font-semibold text-[#ef5350]'
                                        : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-[#ef5350]',
                                )}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {isOpen && (
                                    <span className="tracking-normal">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
}
