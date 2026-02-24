import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    iconColorClass?: string;
    iconBgClass?: string;
    gradient?: string;
}

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    iconColorClass = 'text-slate-600',
    iconBgClass = 'bg-slate-100',
    gradient,
}: SummaryCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            {/* Background Blur Patterns */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-slate-50 opacity-50 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-slate-100" />

            <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                    <p className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                        {title}
                    </p>
                    <h3 className="text-3xl font-black tracking-tight text-slate-900">
                        {value}
                    </h3>
                </div>

                <div className="relative">
                    {/* Glow effect for icon */}
                    <div
                        className={cn(
                            'absolute inset-0 rounded-2xl opacity-0 blur-lg transition-all duration-500 group-hover:opacity-40',
                            gradient
                                ? `bg-gradient-to-br ${gradient}`
                                : iconBgClass,
                        )}
                    />

                    <div
                        className={cn(
                            'relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110',
                            gradient
                                ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                                : `border border-white/50 backdrop-blur-md ${iconBgClass} ${iconColorClass} shadow-sm`,
                        )}
                    >
                        <Icon className="h-7 w-7 transition-all duration-500 group-hover:rotate-12" />
                    </div>
                </div>
            </div>

            {/* Glassmorphism Background elements */}
            {gradient && (
                <div
                    className={cn(
                        'absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20',
                        gradient,
                    )}
                />
            )}
        </div>
    );
}

// Helper to handle class merging safely if not already available
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
