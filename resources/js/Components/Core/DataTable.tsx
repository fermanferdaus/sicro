import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Search,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { router } from '@inertiajs/react';

interface Column {
    key: string;
    label: string;
    render?: (item: any, index: number) => React.ReactNode;
    className?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    meta: Meta;
    filters: {
        search?: string;
        per_page?: number;
    };
    onPageChange: (url: string) => void;
    onSearch?: (search: string) => void;
    onPerPageChange: (perPage: number) => void;
}

export default function DataTable({
    columns,
    data,
    meta,
    filters,
    onPageChange,
    onSearch,
    onPerPageChange,
}: DataTableProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== (filters.search || '') && onSearch) {
                onSearch(search);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search, onSearch]);

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value);
        setPerPage(value);
        onPerPageChange(value);
    };

    return (
        <div className="w-full space-y-4">
            {/* Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-500">
                        Entri
                    </span>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="rounded-lg border-slate-200 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350]/20"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                        <option value="500">500</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-1500 bg-slate-100 text-xs font-bold tracking-wider uppercase">
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`px-6 py-4 ${col.className || ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.length > 0 ? (
                                data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="transition-colors even:bg-slate-50 hover:bg-slate-50/80"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={`${index}-${col.key}`}
                                                className={`px-6 py-4 font-medium text-slate-700 ${col.className || ''}`}
                                            >
                                                {col.render
                                                    ? col.render(item, index)
                                                    : item[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center font-bold text-slate-400"
                                    >
                                        Tidak ada data ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="text-sm font-bold text-slate-500">
                        Menampilkan {meta.from} sampai {meta.to} dari{' '}
                        {meta.total} data
                    </div>
                    <div className="flex items-center gap-1">
                        {meta.links.map((link, i) => {
                            // Render simplified pagination: Prev, Numbers, Next
                            // For simplicity, we just render what Laravel sends, but styling it
                            let label = link.label;
                            if (label.includes('&laquo;'))
                                return (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            link.url && onPageChange(link.url)
                                        }
                                        disabled={!link.url}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                );
                            if (label.includes('&raquo;'))
                                return (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            link.url && onPageChange(link.url)
                                        }
                                        disabled={!link.url}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                );

                            return (
                                <button
                                    key={i}
                                    onClick={() =>
                                        link.url && onPageChange(link.url)
                                    }
                                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                        link.active
                                            ? 'bg-[#ef5350] text-white shadow-md shadow-[#ef5350]/20'
                                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
