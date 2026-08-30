import { useState, useEffect } from 'react';
import { formatRupiah, cn } from '@/lib/utils';
import { CreditCard, Banknote } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';

interface PaymentSectionProps {
    subtotal: number;
    grandTotal: number;
    disabled: boolean;
    onProcessPayment: (method: 'cash' | 'qris', cashAmount: number) => void;
}

export default function PaymentSection({
    grandTotal,
    disabled,
    onProcessPayment,
}: PaymentSectionProps) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris'>('cash');
    const [cashAmountDisplay, setCashAmountDisplay] = useState<string>(''); // For display with Rp
    const [cashAmountValue, setCashAmountValue] = useState<number>(0); // For logic
    const [change, setChange] = useState<number>(0);
    const [isInputFocused, setIsInputFocused] = useState(false);

    useEffect(() => {
        if (paymentMethod === 'cash' && cashAmountValue > 0) {
            setChange(cashAmountValue - grandTotal);
        } else {
            setChange(0);
        }
    }, [cashAmountValue, grandTotal, paymentMethod]);

    const handleProcess = () => {
        const amount = paymentMethod === 'cash' ? cashAmountValue : 0;
        onProcessPayment(paymentMethod, amount);
    };

    const isInsufficient =
        paymentMethod === 'cash' && cashAmountValue < grandTotal;

    return (
        <div className="space-y-3.5 border-t border-slate-200 bg-slate-50/50 p-4 xl:p-5">
            {/* Method Selection */}
            <div className="grid grid-cols-2 gap-2.5">
                <PrimaryButton
                    onClick={() => {
                        setPaymentMethod('cash');
                        setCashAmountDisplay('');
                        setCashAmountValue(0);
                    }}
                    className={cn(
                        'w-full gap-2 rounded-xl py-2.5 text-xs font-bold',
                        paymentMethod === 'cash'
                            ? 'bg-[#ef5350] text-white shadow-md shadow-[#ef5350]/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
                    )}
                >
                    <Banknote className="h-4 w-4" />
                    TUNAI
                </PrimaryButton>
                <PrimaryButton
                    onClick={() => {
                        setPaymentMethod('qris');
                        setCashAmountDisplay('');
                        setCashAmountValue(0);
                    }}
                    className={cn(
                        'w-full gap-2 rounded-xl py-2.5 text-xs font-bold',
                        paymentMethod === 'qris'
                            ? 'bg-[#ef5350] text-white shadow-md shadow-[#ef5350]/20'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
                    )}
                >
                    <CreditCard className="h-4 w-4" />
                    QRIS
                </PrimaryButton>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
                <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold tracking-wider text-slate-900 uppercase">
                        Uang Diterima
                    </label>
                    <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-slate-500 transition-colors">
                            Rp
                        </span>
                        <input
                            type="text"
                            value={cashAmountDisplay.replace('Rp ', '')}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                const numberValue = parseInt(value) || 0;
                                setCashAmountValue(numberValue);
                                setCashAmountDisplay(
                                    value
                                        ? formatRupiah(numberValue).replace(
                                              'Rp ',
                                              '',
                                          )
                                        : '',
                                );
                            }}
                            placeholder="0"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-8 text-sm font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20 focus:outline-none"
                        />
                    </div>

                    {/* Quick Amount Hints could go here */}

                    {change > 0 && (
                        <div className="flex animate-in items-center justify-between text-xs font-bold text-green-700 fade-in slide-in-from-top-1">
                            <span>Kembalian</span>
                            <span className="text-xs">
                                {formatRupiah(change)}
                            </span>
                        </div>
                    )}
                    {isInsufficient && cashAmountDisplay !== '' && (
                        <div className="flex animate-in items-center gap-1.5 text-[11px] font-bold text-[#ef5350] fade-in slide-in-from-top-1">
                            <span>•</span>
                            <span>Nominal Kurang</span>
                        </div>
                    )}
                </div>
            )}

            {/* Totals */}
            <div className="flex justify-between items-center font-black text-[#ef5350]">
                <span className="text-xs font-bold text-slate-600">Total Bayar</span>
                <span className="text-base font-extrabold">{formatRupiah(grandTotal)}</span>
            </div>

            {/* Process Button */}
            <PrimaryButton
                onClick={handleProcess}
                disabled={disabled || isInsufficient}
                className="w-full gap-2 rounded-xl py-3 text-sm font-black transition-all active:scale-[0.98] disabled:opacity-40"
            >
                <span>BAYAR SEKARANG</span>
            </PrimaryButton>
        </div>
    );
}
