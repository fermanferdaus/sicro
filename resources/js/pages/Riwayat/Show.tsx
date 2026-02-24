import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import TransactionReceipt from '@/Components/Transaction/TransactionReceipt';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import {
    ArrowLeft,
    Printer,
    Utensils,
    Calendar,
    Clock,
    User,
} from 'lucide-react';
import { formatRupiah, formatDateLong } from '@/lib/utils';

interface TransactionDetailProps {
    transaction: {
        id_transaksi: string;
        id_user: string;
        nomor_faktur: string; // From relation
        tanggal: string;
        created_at: string;
        subtotal: number;
        jumlah_bayar: number;
        kembalian: number;
        metode_bayar: string;
        kasir: {
            nama_lengkap: string;
        };
        nama_kasir: string;
        faktur: {
            nomor_faktur: string;
        };
        details: Array<{
            id_detail: string;
            qty: number;
            harga_satuan: number;
            total: number;
            produk: {
                nama_produk: string;
                gambar?: string;
            };
        }>;
    };
}

export default function Show({ transaction }: TransactionDetailProps) {
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [search, setSearch] = useState('');

    const handlePrint = () => {
        setIsReceiptOpen(true);
    };

    // Filter items based on search
    const filteredDetails = transaction.details.filter((item) =>
        item.produk.nama_produk.toLowerCase().includes(search.toLowerCase()),
    );

    // Transform transaction data for receipt
    const receiptData = {
        nomor_faktur: transaction.faktur?.nomor_faktur || '-',
        tanggal: transaction.tanggal,
        waktu: new Date(transaction.created_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        }),
        kasir:
            transaction.nama_kasir ||
            transaction.kasir?.nama_lengkap ||
            'Unknown',
        items: transaction.details.map((detail) => ({
            id_produk: '', // Not strictly needed for display
            nama_produk: detail.produk.nama_produk,
            harga_jual: detail.harga_satuan,
            quantity: detail.qty,
        })),
        subtotal: transaction.subtotal,
        tax: 0,
        total: transaction.subtotal,
        bayar: transaction.jumlah_bayar,
        kembalian: transaction.kembalian,
        metode_bayar: (transaction.metode_bayar === 'tunai'
            ? 'cash'
            : transaction.metode_bayar) as 'cash' | 'qris',
    };

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head
                title={`Detail Transaksi ${transaction.faktur?.nomor_faktur || ''}`}
            />

            <TransactionReceipt
                isOpen={isReceiptOpen}
                onClose={() => setIsReceiptOpen(false)}
                data={receiptData}
            />

            <div className="">
                {/* Header Navigation */}
                <div className="mb-4 flex items-center justify-between print:hidden">
                    <div>
                        <Link
                            href={route('transaksi.history')}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Detail Transaksi
                        </h1>
                    </div>
                    <PrimaryButton onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Struk
                    </PrimaryButton>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Main Receipt Content */}
                    <div className="lg:col-span-3">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/50 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">
                                            {transaction.faktur?.nomor_faktur}
                                        </h2>
                                        <p className="text-sm font-medium text-slate-500">
                                            Order ID: {transaction.id_transaksi}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700 uppercase">
                                        Selesai
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Order Items */}
                                <div className="space-y-6">
                                    {filteredDetails.length > 0 ? (
                                        filteredDetails.map((item) => (
                                            <div
                                                key={item.id_detail}
                                                className="flex items-start gap-4"
                                            >
                                                <div className="h-16 w-16 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                    {item.produk.gambar ? (
                                                        <img
                                                            src={
                                                                item.produk
                                                                    .gambar
                                                            }
                                                            alt={
                                                                item.produk
                                                                    .nama_produk
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                            <Utensils className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-slate-900">
                                                        {
                                                            item.produk
                                                                .nama_produk
                                                        }
                                                    </h3>
                                                    <p className="text-sm font-medium text-slate-500">
                                                        {item.qty} x{' '}
                                                        {formatRupiah(
                                                            item.harga_satuan,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-slate-900">
                                                        {formatRupiah(
                                                            item.total,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center">
                                            <p className="font-medium text-slate-500">
                                                Produk tidak ditemukan dalam
                                                transaksi ini.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="my-6 border-t border-dashed border-slate-200"></div>

                                {/* Summary */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">
                                            {formatRupiah(transaction.subtotal)}
                                        </span>
                                    </div>
                                    {/* Tax if applicable */}
                                    <div className="flex justify-between text-lg font-black text-slate-900">
                                        <span>Total</span>
                                        <span className="text-[#ef5350]">
                                            {formatRupiah(transaction.subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-6">
                        {/* Payment Info */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase">
                                Pembayaran
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-900">
                                        Metode
                                    </span>
                                    <span className="font-bold text-slate-900 uppercase">
                                        {transaction.metode_bayar}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-900">
                                        Bayar
                                    </span>
                                    <span className="font-bold text-slate-900">
                                        {formatRupiah(transaction.jumlah_bayar)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-900">
                                        Kembalian
                                    </span>
                                    <span className="font-bold text-green-600">
                                        {formatRupiah(transaction.kembalian)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Info */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-bold tracking-wider text-slate-900 uppercase">
                                Informasi
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">
                                            Tanggal
                                        </p>
                                        <p className="font-bold text-slate-700">
                                            {formatDateLong(
                                                transaction.tanggal,
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">
                                            Waktu
                                        </p>
                                        <p className="font-bold text-slate-700">
                                            {new Date(
                                                transaction.created_at,
                                            ).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-900">
                                            Kasir
                                        </p>
                                        <p className="font-bold text-slate-700">
                                            {transaction.nama_kasir ||
                                                transaction.kasir
                                                    ?.nama_lengkap ||
                                                'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
