import { Link } from '@inertiajs/react';
import { formatRupiah } from '@/lib/utils';
import { ArrowUpRight, Clock, Receipt, ShoppingCart } from 'lucide-react';

export interface RecentTransaction {
    id_transaksi: string;
    faktur: {
        nomor_faktur: string;
    } | null;
    kasir: {
        nama_lengkap: string;
    } | null;
    nama_kasir: string;
    subtotal: number;
    metode_bayar: string;
    tanggal: string;
    created_at: string;
}

interface RecentTransactionsProps {
    transactions: RecentTransaction[];
    title?: string;
    subtitle?: string;
    viewAllHref?: string;
    className?: string;
}

const metodeBadge = (metode: string) => {
    const styles: Record<string, string> = {
        tunai: 'bg-emerald-50 text-emerald-700',
        transfer: 'bg-blue-50 text-blue-700',
        qris: 'bg-purple-50 text-purple-700',
    };
    return styles[metode?.toLowerCase()] || 'bg-slate-50 text-slate-700';
};

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function RecentTransactions({
    transactions,
    title = 'Transaksi Hari Ini',
    subtitle,
    viewAllHref,
    className = '',
}: RecentTransactionsProps) {
    const displaySubtitle =
        subtitle ?? `${transactions.length} transaksi terbaru`;

    return (
        <div
            className={`flex flex-col rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}
        >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ef5350] to-[#e53935] text-white shadow-lg shadow-red-200/50">
                        <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-400">
                            {displaySubtitle}
                        </p>
                    </div>
                </div>
                {viewAllHref && (
                    <Link
                        href={viewAllHref}
                        className="group flex items-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-[#ef5350] transition-all hover:bg-red-50"
                    >
                        Lihat Semua
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                )}
            </div>

            {/* Transactions List */}
            <div className="flex min-h-0 flex-1 flex-col divide-y divide-slate-50 overflow-y-auto">
                {transactions.length > 0 ? (
                    transactions.map((trx, index) => (
                        <Link
                            key={trx.id_transaksi}
                            href={route('transaksi.show', trx.id_transaksi)}
                            className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80"
                        >
                            {/* Index Number */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 transition-colors group-hover:bg-[#ef5350]/10 group-hover:text-[#ef5350]">
                                {index + 1}
                            </div>

                            {/* Transaction Info */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-sm font-bold text-slate-800">
                                        {trx.faktur?.nomor_faktur || '-'}
                                    </span>
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${metodeBadge(trx.metode_bayar)}`}
                                    >
                                        {trx.metode_bayar}
                                    </span>
                                </div>
                                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatTime(trx.created_at)}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>
                                        {trx.kasir?.nama_lengkap ||
                                            trx.nama_kasir ||
                                            '-'}
                                    </span>
                                </div>
                            </div>

                            {/* Amount */}
                            <span className="shrink-0 text-sm font-bold text-slate-900">
                                {formatRupiah(trx.subtotal)}
                            </span>
                        </Link>
                    ))
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                            <ShoppingCart className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">
                            Belum ada transaksi hari ini
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
