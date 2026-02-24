import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import SummaryCard from '@/Components/Core/SummaryCard';
import SalesChart from '@/Components/Core/SalesChart';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';
import { formatRupiah } from '@/lib/utils';
import useAuth from '@/Hooks/useAuth';
import {
    Banknote,
    Package,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
} from 'lucide-react';

interface DashboardProps {
    total_transaksi: number;
    total_produk: number;
    total_omset: number;
    total_pengeluaran?: number;
    laba_bersih?: number;
    sales_chart: { date: string; total: number }[];
    expense_chart?: { date: string; total: number }[];
}

export default function Dashboard({
    total_transaksi,
    total_produk,
    total_omset,
    total_pengeluaran,
    laba_bersih,
    sales_chart,
    expense_chart,
}: DashboardProps) {
    const { user, isOwner } = useAuth();
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <>
                        <h2 className="mb-4 text-xl font-semibold">
                            Selamat datang, {user.nama_lengkap}!
                        </h2>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <SummaryCard
                                title="Total Transaksi"
                                value={total_transaksi}
                                icon={ShoppingCart}
                                gradient="from-blue-500 to-blue-600"
                            />
                            <SummaryCard
                                title="Total Produk Aktif"
                                value={total_produk}
                                icon={Package}
                                gradient="from-green-500 to-green-600"
                            />
                            <SummaryCard
                                title="Total Omset"
                                value={formatRupiah(total_omset)}
                                icon={Banknote}
                                gradient="from-purple-500 to-purple-600"
                            />

                            {isOwner && total_pengeluaran !== undefined && (
                                <SummaryCard
                                    title="Total Pengeluaran"
                                    value={formatRupiah(total_pengeluaran)}
                                    icon={TrendingDown}
                                    gradient="from-red-500 to-red-600"
                                />
                            )}

                            {isOwner && laba_bersih !== undefined && (
                                <SummaryCard
                                    title="Pendapatan Bersih"
                                    value={formatRupiah(laba_bersih)}
                                    icon={TrendingUp}
                                    gradient="from-emerald-500 to-emerald-600"
                                />
                            )}
                        </div>

                        <div className="mt-8 space-y-8">
                            {sales_chart && sales_chart.length > 0 ? (
                                <SalesChart
                                    data={sales_chart}
                                    title="Grafik Penjualan"
                                />
                            ) : (
                                <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                    <h3 className="mb-2 text-left text-lg font-bold text-slate-800">
                                        Grafik Penjualan
                                    </h3>
                                    <div className="text-slate-500">
                                        <p>
                                            Tidak ada data penjualan untuk
                                            ditampilkan.
                                        </p>
                                    </div>
                                </div>
                            )}
                            {isOwner && (
                                <>
                                    {expense_chart &&
                                    expense_chart.length > 0 ? (
                                        <SalesChart
                                            data={expense_chart}
                                            title="Grafik Pengeluaran"
                                        />
                                    ) : (
                                        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                            <h3 className="mb-2 text-left text-lg font-bold text-slate-800">
                                                Grafik Pengeluaran
                                            </h3>
                                            <p className="text-slate-500">
                                                Tidak ada data pengeluaran untuk
                                                ditampilkan.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
