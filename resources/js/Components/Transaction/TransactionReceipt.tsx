import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Printer, Utensils } from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/Form/PrimaryButton';

interface ReceiptItem {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    quantity: number;
}

export interface ReceiptData {
    nomor_faktur: string;
    tanggal: string; // Formatting handled in parent or here
    waktu: string;
    kasir: string;
    items: ReceiptItem[];
    subtotal: number;
    tax: number;
    total: number;
    bayar: number;
    kembalian: number;
    metode_bayar: 'cash' | 'qris';
}

interface TransactionReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    data: ReceiptData | null;
}

export default function TransactionReceipt({
    isOpen,
    onClose,
    data,
}: TransactionReceiptProps) {
    const { profil } = usePage<any>().props;

    if (!data) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Print Styles */}
                <style>{`
                    @media print {
                        @page {
                            size: 58mm auto;
                            margin: 0;
                        }
                        body * {
                            visibility: hidden;
                        }
                        #receipt-print-area, #receipt-print-area * {
                            visibility: visible;
                        }
                        #receipt-print-area {
                            position: fixed;
                            left: 0;
                            top: 0;
                            width: 58mm;
                            margin: 0;
                            padding: 10px; /* Optional small padding */
                            border-radius: 0;
                            box-shadow: none;
                            background: white;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                        /* Custom tighter spacing for thermal printing */
                        #receipt-print-area h1 { font-size: 14px !important; margin-bottom: 2px !important; line-height: 1 !important; }
                        #receipt-print-area h3 { font-size: 11px !important; margin-bottom: 0 !important; line-height: 1 !important; }
                        #receipt-print-area p, #receipt-print-area span { font-size: 9px !important; line-height: 1.6 !important; }
                        #receipt-print-area .border-y { padding-top: 2px !important; padding-bottom: 2px !important; margin-top: 2px !important; margin-bottom: 2px !important; }
                    }
                `}</style>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity print:hidden" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto print:overflow-visible">
                    <div className="flex min-h-full items-center justify-center p-4 text-center print:block print:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                id="receipt-print-area"
                                className="relative w-full max-w-sm transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl transition-all print:w-full print:max-w-none print:rounded-none print:shadow-none"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 z-50 rounded-full bg-slate-100/50 p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 print:hidden"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="p-6 print:p-0">
                                    {/* Header Section */}
                                    <div className="mb-2 text-center print:mb-1">
                                        <div className="mx-auto -mb-2 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-50 print:h-20 print:w-20">
                                            {profil?.logo_url ? (
                                                <img
                                                    src={profil.logo_url}
                                                    alt={profil.nama_store}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Utensils className="h-10 w-10 text-slate-300 print:h-8 print:w-8" />
                                            )}
                                        </div>
                                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase print:text-sm">
                                            {profil?.nama_store || 'SICRO'}
                                        </h1>
                                        {profil?.alamat && (
                                            <p className="mt-1 text-sm font-medium text-slate-500 print:mt-0 print:text-[8px] print:leading-none">
                                                {profil.alamat}
                                            </p>
                                        )}
                                        <p className="mt-1 text-sm font-medium text-slate-500 print:mt-0 print:text-[8px] print:leading-none">
                                            Tlp. {profil.telepon}
                                        </p>
                                    </div>

                                    {/* Receipt Metadata */}
                                    <div className="mb-1 border-y border-dashed border-slate-300 py-2 text-sm print:text-[10px]">
                                        <div className="flex items-start gap-1">
                                            <span className="w-25 font-extrabold uppercase print:w-18 print:text-[8px]">
                                                No. Invoice
                                            </span>
                                            <span className="font-bold text-[#ef5350]">
                                                : {data.nomor_faktur}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1">
                                            <span className="w-25 font-extrabold uppercase print:w-18 print:text-[8px]">
                                                Waktu
                                            </span>
                                            <span className="font-semibold text-slate-700">
                                                : {formatDate(data.tanggal)},{' '}
                                                {data.waktu}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1">
                                            <span className="w-25 font-extrabold uppercase print:w-18 print:text-[8px]">
                                                Kasir
                                            </span>
                                            <span className="font-semibold text-slate-700">
                                                : {data.kasir}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1">
                                            <span className="w-25 font-extrabold uppercase print:w-18 print:text-[8px]">
                                                Metode
                                            </span>
                                            <span className="font-semibold text-slate-700">
                                                :{' '}
                                                {data.metode_bayar.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Itemized List */}
                                    <div className="space-y-0.5 print:mt-1.5 print:space-y-0">
                                        {data.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start justify-between py-0.5 print:py-0"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="text-sm leading-tight font-bold text-slate-800 print:text-xs print:leading-none">
                                                        {item.nama_produk}
                                                    </h3>
                                                    <span className="block text-xs leading-tight text-slate-500 print:text-[10px] print:leading-none">
                                                        {item.quantity}x{' '}
                                                        {formatRupiah(
                                                            item.harga_jual,
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="text-sm leading-tight font-bold text-slate-800 print:text-xs print:leading-none">
                                                    {formatRupiah(
                                                        item.harga_jual *
                                                            item.quantity,
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pricing Summary */}
                                    <div className="mt-2 mb-2 space-y-1 border-t border-dashed border-slate-300 print:mt-0.5 print:mb-1 print:space-y-0 print:pt-0.5">
                                        <div className="mt-2 flex items-center justify-between print:mt-0.5 print:leading-none">
                                            <span className="text-sm font-extrabold text-slate-900">
                                                TOTAL
                                            </span>
                                            <span className="text-sm font-extrabold text-[#ef5350]">
                                                {formatRupiah(data.total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm print:mt-0 print:text-xs print:leading-none">
                                            <span className="text-sm font-extrabold">
                                                BAYAR
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                {formatRupiah(data.bayar)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm print:text-xs print:leading-none">
                                            <span className="text-sm font-extrabold">
                                                KEMBALIAN
                                            </span>
                                            <span className="font-bold text-green-600">
                                                {formatRupiah(data.kembalian)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Quote */}
                                    <div className="space-y-1 border-t border-dashed border-slate-300 pt-1 print:mt-0 print:space-y-0 print:border-t print:border-dashed print:border-slate-300 print:pt-0">
                                        <div className="mt-1 text-center print:mt-2">
                                            <p className="text-[11px] text-slate-400 italic print:text-[8px] print:leading-none">
                                                Terima kasih telah berkunjung!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-2 print:hidden">
                                        <PrimaryButton
                                            onClick={handlePrint}
                                            className="w-full gap-2 rounded-xl py-4 font-bold shadow-lg shadow-[#ef5350]/30 transition-all active:scale-[0.98]"
                                        >
                                            <Printer className="h-5 w-5" />
                                            Cetak Struk
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
