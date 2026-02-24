import { Head, router, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { formatRupiah } from '@/lib/utils';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface CartItem {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar?: string;
    quantity: number;
}

interface QrisProps {
    cart: string;
    total: number;
}

export default function Qris({ cart: cartJson, total }: QrisProps) {
    const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

    const handleSelesai = () => {
        router.post(route('transaksi.store'), {
            items: cart.map((item) => ({
                id_produk: item.id_produk,
                qty: item.quantity,
            })),
            jumlah_bayar: total,
            kategori: 'takeaway',
            metode_bayar: 'qris',
        });
    };

    const handleBatal = () => {
        router.get(route('transaksi.index'));
    };

    return (
        <MainLayout>
            <Head title="Pembayaran QRIS" />

            <div className="mx-auto max-w-full">
                {/* Header/Back Button */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <Link
                            href={route('transaksi.index')}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Pembayaran QRIS
                        </h1>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
                        {/* Left Side: QRIS Image */}
                        <div className="flex flex-col items-center justify-center p-8 lg:p-12">
                            <img
                                src="/Qris.png"
                                alt="QRIS Payment"
                                className="h-96 w-96 object-contain"
                            />
                            <p className="mt-8 text-center text-sm font-medium text-slate-400">
                                Silahkan scan kode QR di atas untuk melakukan
                                pembayaran
                            </p>
                        </div>

                        {/* Right Side: Nominal & Actions */}
                        <div className="flex flex-col justify-between bg-slate-50/30 p-8 lg:p-12">
                            <div className="space-y-8">
                                <div>
                                    <label className="text-xs font-black tracking-widest text-slate-400 uppercase">
                                        Total Pembayaran
                                    </label>
                                    <div className="mt-2 text-3xl font-black tracking-tight text-[#ef5350]">
                                        {formatRupiah(total)}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        Detail Pesanan
                                    </h3>
                                    <div className="custom-scrollbar max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                        {cart.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between border-b border-slate-100 last:border-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {item.nama_produk}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {item.quantity} x{' '}
                                                        {formatRupiah(
                                                            item.harga_jual,
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-extrabold text-slate-800">
                                                    {formatRupiah(
                                                        item.harga_jual *
                                                            item.quantity,
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleBatal}
                                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 active:scale-95"
                                >
                                    Batal
                                </button>
                                <PrimaryButton
                                    onClick={handleSelesai}
                                    className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold shadow-lg shadow-[#ef5350]/30 transition-all active:scale-95"
                                >
                                    Selesai
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
