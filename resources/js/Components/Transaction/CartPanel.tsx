import { useState, useEffect } from 'react';
import { formatRupiah, cn } from '@/lib/utils';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import PaymentSection from './PaymentSection';
import PrimaryButton from '@/Components/Form/PrimaryButton';

interface CartItem {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar?: string;
    quantity: number;
}

interface CartPanelProps {
    cart: CartItem[];
    onUpdateQuantity: (id_produk: string, delta: number) => void;
    onClearCart: () => void;
    onProcessPayment: (method: 'cash' | 'qris', cashAmount?: number) => void;
    paymentKey?: number;
}

export default function CartPanel({
    cart,
    onUpdateQuantity,
    onClearCart,
    onProcessPayment,
    paymentKey = 0,
}: CartPanelProps) {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.harga_jual * item.quantity,
        0,
    );
    const grandTotal = subtotal;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (cart.length === 0 && isMobileOpen) {
            setIsMobileOpen(false);
        }
    }, [cart.length, isMobileOpen]);

    return (
        <>
            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 z-30 flex w-full items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] lg:hidden">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500">
                        Keranjang
                    </span>
                    <span className="text-lg font-extrabold text-[#ef5350]">
                        {formatRupiah(grandTotal)}
                    </span>
                </div>
                <button
                    onClick={() => setIsMobileOpen(true)}
                    disabled={cart.length === 0}
                    className="flex items-center gap-2 rounded-xl bg-[#ef5350] px-6 py-3 font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    <ShoppingCart className="h-5 w-5" />
                    Checkout ({cart.length})
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={cn(
                    'fixed inset-x-0 bottom-0 z-50 flex h-[85vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 lg:static lg:h-full lg:min-h-0 lg:w-[340px] xl:w-[380px] lg:shrink-0 lg:translate-y-0 lg:rounded-2xl lg:shadow-sm lg:border lg:border-slate-200/80 overflow-hidden',
                    isMobileOpen ? 'translate-y-0' : 'translate-y-full',
                )}
            >
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between border-b border-slate-100 p-4 lg:p-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingCart className="h-6 w-6 text-[#ef5350]" />
                            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#ef5350] text-[10px] font-bold text-white">
                                {cart.length}
                            </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-slate-900">
                            Detail Pesanan
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        {cart.length > 0 && (
                            <PrimaryButton
                                onClick={onClearCart}
                                className="h-8 border border-red-100 bg-white px-3 text-[11px] tracking-wider text-red-500 uppercase hover:bg-red-50"
                            >
                                Hapus
                            </PrimaryButton>
                        )}
                        <button
                            onClick={() => setIsMobileOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 lg:hidden"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Cart Items */}
                <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto p-4 lg:p-5">
                    {cart.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-slate-400">
                            <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
                            <p className="text-sm font-medium">
                                Keranjang kosong
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id_produk}
                                    className="group flex items-start gap-4"
                                >
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-sm">
                                        {item.gambar ? (
                                            <img
                                                src={item.gambar}
                                                alt={item.nama_produk}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                <span className="text-xl font-black text-slate-300">
                                                    {item.nama_produk
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')
                                                        .toUpperCase()
                                                        .substring(0, 2)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="mb-1 text-sm leading-tight font-bold text-slate-800">
                                            {item.nama_produk}
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            item.id_produk,
                                                            -1,
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-sm transition-all hover:text-[#ef5350] active:scale-90"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-6 text-center text-xs font-bold text-slate-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            item.id_produk,
                                                            1,
                                                        )
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ef5350] text-white shadow-sm transition-all active:scale-90"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-extrabold text-slate-800">
                                                {formatRupiah(
                                                    item.harga_jual *
                                                        item.quantity,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payment Section */}
                <div className="shrink-0">
                    <PaymentSection
                        key={paymentKey}
                        subtotal={subtotal}
                        grandTotal={grandTotal}
                        disabled={cart.length === 0}
                        onProcessPayment={onProcessPayment}
                    />
                </div>
            </div>
        </>
    );
}
