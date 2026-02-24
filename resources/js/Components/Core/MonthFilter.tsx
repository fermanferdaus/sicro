import { Filter } from 'lucide-react';

interface MonthFilterProps {
    value: string; // Format: YYYY-MM
    onChange: (value: string) => void;
    label?: string;
    className?: string;
}

export default function MonthFilter({
    value,
    onChange,
    label = 'Bulanan',
    className = '',
}: MonthFilterProps) {
    return (
        <div
            className={`flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 ${className}`}
        >
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
                Tanggal
            </h3>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20 transition-all"
                    >
                        {label}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <input
                        type="month"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                    />
                </div>
            </div>
        </div>
    );
}
