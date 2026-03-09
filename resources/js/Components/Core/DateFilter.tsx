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

        // Always reset to today/current month when switching modes
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        if (newType === 'daily') {
            onDateChange(todayStr, todayStr);
        } else if (newType === 'monthly' || newType === 'period') {
            const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
            const formattedLastDay = lastDay.toString().padStart(2, '0');
            onDateChange(
                `${year}-${month}-01`,
                `${year}-${month}-${formattedLastDay}`,
            );
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

                <div className="flex items-center gap-3">
                    <Filter className="h-5 w-5 text-slate-400" />
                    {filterType === 'daily' && (
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                onDateChange(e.target.value, e.target.value)
                            }
                            className="w-40 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors focus:border-[#ef5350] focus:ring-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
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
                            className="w-48 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors focus:border-[#ef5350] focus:ring-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
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
                                className="w-40 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors focus:border-[#ef5350] focus:ring-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                            />
                            <span className="font-bold text-slate-300">-</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    onDateChange(startDate, e.target.value)
                                }
                                className="w-40 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors focus:border-[#ef5350] focus:ring-0 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
