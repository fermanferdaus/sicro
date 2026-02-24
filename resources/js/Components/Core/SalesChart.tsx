import { useState, useEffect, useRef } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';
import { formatRupiah } from '@/lib/utils';

interface SalesChartProps {
    data: {
        date: string;
        total: number;
    }[];
    title?: string;
}

export default function SalesChart({
    data,
    title = 'Grafik Penjualan',
}: SalesChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth - 48); // Subtracting padding (p-6 = 24px each side)
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        handleResize(); // Initial check

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
        >
            {/* Background Blur Patterns */}
            <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-slate-50 opacity-40 blur-3xl transition-all duration-700 group-hover:scale-125 group-hover:bg-slate-100" />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#ef5350]/5 opacity-20 blur-3xl transition-all duration-700 group-hover:scale-125" />

            <div className="relative mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-900">
                        {title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                        Statistik data terbaru
                    </p>
                </div>
            </div>

            <div className="relative h-[350px] w-full">
                {width > 0 && (
                    <AreaChart
                        width={width}
                        height={350}
                        data={data}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 10,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="barGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#ef5350"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#ef5350"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#f1f5f9"
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#94a3b8',
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: '#94a3b8',
                                fontSize: 11,
                                fontWeight: 600,
                            }}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat('id-ID', {
                                    notation: 'compact',
                                    compactDisplay: 'short',
                                }).format(value)
                            }
                        />
                        <Tooltip
                            cursor={{ fill: '#f8fafc', radius: 8 }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-2xl backdrop-blur-md">
                                            <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                {label}
                                            </p>
                                            <p className="text-base font-black text-slate-900">
                                                {formatRupiah(
                                                    payload[0].value as number,
                                                )}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#ef5350"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#barGradient)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                )}
            </div>
        </div>
    );
}
