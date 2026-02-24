import { Filter } from 'lucide-react';

type FilterType = 'daily' | 'monthly' | 'period';

interface DateFilterProps {
    filterType: FilterType;
    startDate: string;
    endDate: string;
    onFilterTypeChange: (type: FilterType) => void;
    onDateChange: (start: string, end: string) => void;
    className?: string;
}

export default function DateFilter({
    filterType,
    startDate,
    endDate,
    onFilterTypeChange,
    onDateChange,
    className = '',
}: DateFilterProps) {
    const handleTypeChange = (newType: FilterType) => {
        onFilterTypeChange(newType);

        if (newType === 'monthly' || newType === 'period') {
            // Adjust to full month range of the current startDate
            const [year, month] = startDate.split('-').map(Number);
            if (!isNaN(year) && !isNaN(month)) {
                const lastDay = new Date(year, month, 0).getDate();
                const formattedLastDay = lastDay.toString().padStart(2, '0');
                const monthStr = startDate.substring(0, 7);
                onDateChange(
                    `${monthStr}-01`,
                    `${monthStr}-${formattedLastDay}`,
                );
            }
        } else if (newType === 'daily') {
            // Adjust to just the startDate
            onDateChange(startDate, startDate);
        }
    };

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
                        onClick={() => handleTypeChange('daily')}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                            filterType === 'daily'
                                ? 'bg-white text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20'
                                : 'text-slate-500 hover:bg-slate-200/50'
                        }`}
                    >
                        Harian
                    </button>
                    <button
                        onClick={() => handleTypeChange('monthly')}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                            filterType === 'monthly'
                                ? 'bg-white text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20'
                                : 'text-slate-500 hover:bg-slate-200/50'
                        }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => handleTypeChange('period')}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                            filterType === 'period'
                                ? 'bg-white text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20'
                                : 'text-slate-500 hover:bg-slate-200/50'
                        }`}
                    >
                        Periode
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    {filterType === 'daily' && (
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                onDateChange(e.target.value, e.target.value)
                            }
                            className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                        />
                    )}
                    {filterType === 'monthly' && (
                        <input
                            type="month"
                            value={startDate.substring(0, 7)} // Display YYYY-MM
                            onChange={(e) => {
                                const val = e.target.value; // YYYY-MM
                                if (!val) return;
                                const [year, month] = val
                                    .split('-')
                                    .map(Number);
                                // JS Date month is 0-indexed, but day 0 of month+1 is the last day of month
                                const lastDay = new Date(
                                    year,
                                    month,
                                    0,
                                ).getDate();
                                const formattedLastDay = lastDay
                                    .toString()
                                    .padStart(2, '0');
                                onDateChange(
                                    `${val}-01`,
                                    `${val}-${formattedLastDay}`,
                                );
                            }}
                            className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                        />
                    )}
                    {filterType === 'period' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    onDateChange(e.target.value, endDate)
                                }
                                className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    onDateChange(startDate, e.target.value)
                                }
                                className="rounded-lg border-slate-200 text-sm font-medium text-slate-700 focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
