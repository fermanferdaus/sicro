import { cn } from '@/lib/utils';

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
    className?: string;
}

export default function CategoryFilter({
    categories,
    selectedCategory,
    onCategoryChange,
    className = '',
}: CategoryFilterProps) {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4',
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="px-0.5 text-sm font-bold tracking-tight text-slate-900">
                    Kategori
                </h3>
                {selectedCategory && (
                    <button
                        onClick={() => onCategoryChange(null)}
                        className="flex items-center gap-1 pr-2 text-xs font-bold text-red-500 hover:text-red-600"
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto px-0.5 py-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={cn(
                        'shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-all',
                        selectedCategory === null
                            ? 'bg-white text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20'
                            : 'bg-slate-50 text-slate-500 hover:bg-slate-100',
                    )}
                >
                    Semua
                </button>

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={cn(
                            'shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-all',
                            selectedCategory === category
                                ? 'bg-white text-[#ef5350] shadow-sm ring-1 ring-[#ef5350]/20'
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100',
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
