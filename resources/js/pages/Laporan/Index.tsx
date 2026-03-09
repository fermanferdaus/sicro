import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import useAuth from '@/Hooks/useAuth';

export default function Index() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const handleSearch = (val: string) => {
        setSearch(val);
    };
    return (
        <MainLayout onSearch={handleSearch} searchValue={search}>
            <Head title="Laporan" />
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Laporan</h1>
                <p className="text-slate-500">
                    Pilih jenis laporan yang ingin ditampilkan
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link
                    href={route('laporan.penjualan')}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
                >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#ef5350] transition-colors group-hover:bg-[#ef5350] group-hover:text-white">
                        <ShoppingBag className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">
                        Laporan Penjualan
                    </h3>
                    <p className="text-sm text-slate-500">
                        Lihat ringkasan penjualan, omset, dan detail transaksi
                        per periode.
                    </p>
                </Link>

                <Link
                    href={route('laporan.produk')}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
                >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                        <Package className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">
                        Laporan Produk
                    </h3>
                    <p className="text-sm text-slate-500">
                        Lihat daftar produk, stok, harga, dan status
                        ketersediaan.
                    </p>
                </Link>

                {user?.role === 'owner' && (
                    <Link
                        href={route('laporan.laba-rugi')}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
                    >
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-slate-900">
                            Laporan Laba Rugi
                        </h3>
                        <p className="text-sm text-slate-500">
                            Analisis keuntungan bersih dari omset dikurangi
                            semua biaya operasional.
                        </p>
                    </Link>
                )}
            </div>{' '}
        </MainLayout>
    );
}
