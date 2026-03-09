import { useState, useRef } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DataTable from '@/Components/Core/DataTable';
import SummaryCard from '@/Components/Core/SummaryCard';
import DateFilter from '@/Components/Core/DateFilter';
import { formatDateLong, formatRupiah } from '@/lib/utils';
import { Eye, ShoppingCart, Banknote } from 'lucide-react';

interface Transaction {
    id_transaksi: string;
    faktur: {
        nomor_faktur: string;
    };
    id_user: string;
    kasir: {
        nama_lengkap: string;
    };
    nama_kasir: string;
    tanggal: string;
    created_at: string;
    subtotal: number;
    jumlah_bayar: number;
    metode_bayar: string;
}

interface Props {
    transactions: {
        data: Transaction[]; // Now an array of all transactions
        total_transactions: number;
        total_revenue: number;
    };
    filters: {
        search?: string;
        per_page?: number;
        filter_type?: 'daily' | 'monthly' | 'period';
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({ transactions, filters }: Props) {
    // State for Client-Side Filtering
    const [search, setSearch] = useState(filters.search || '');
    const [filterType, setFilterType] = useState<
        'daily' | 'monthly' | 'period'
    >(filters.filter_type || 'monthly');
    const filterTypeRef = useRef(filterType);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    // State for Client-Side Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(filters.per_page || 10);

    // Filter Logic
    const filteredTransactions = transactions.data.filter((item) => {
        const matchesSearch = search
            ? item.faktur.nomor_faktur
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
              (item.nama_kasir || item.kasir?.nama_lengkap || '')
                  .toLowerCase()
                  .includes(search.toLowerCase())
            : true;
        return matchesSearch;
    });

    // Pagination Logic
    const lastPage = Math.ceil(filteredTransactions.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredTransactions.length);
    const paginatedData = filteredTransactions.slice(from, to);

    // Generate Pagination Links
    const links = [];

    // Previous
    links.push({
        url: currentPage > 1 ? `#page=${currentPage - 1}` : null,
        label: '&laquo; Previous',
        active: false,
    });

    const delta = 2;
    for (let i = 1; i <= lastPage; i++) {
        if (
            i === 1 ||
            i === lastPage ||
            (i >= currentPage - delta && i <= currentPage + delta)
        ) {
            links.push({
                url: `#page=${i}`,
                label: i.toString(),
                active: i === currentPage,
            });
        } else if (
            links[links.length - 1].label !== '...' &&
            links.length > 1
        ) {
            links.push({
                url: null,
                label: '...',
                active: false,
            });
        }
    }

    // Next
    links.push({
        url: currentPage < lastPage ? `#page=${currentPage + 1}` : null,
        label: 'Next &raquo;',
        active: false,
    });

    const paginationMeta = {
        current_page: currentPage,
        from: from + 1,
        last_page: lastPage,
        links: links,
        path: '',
        per_page: perPage,
        to: to,
        total: filteredTransactions.length,
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Transaction, index: number) => (
                <span className="font-bold text-slate-500">
                    {from + index + 1}
                </span>
            ),
        },
        {
            key: 'nomor_faktur',
            label: 'Invoice',
            render: (item: Transaction) => (
                <span className="font-bold text-slate-700">
                    {item.faktur?.nomor_faktur || '-'}
                </span>
            ),
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (item: Transaction) => (
                <span className="text-slate-500">
                    {formatDateLong(item.tanggal)}
                </span>
            ),
        },
        {
            key: 'waktu',
            label: 'Waktu',
            render: (item: Transaction) => (
                <span className="text-slate-500">
                    {new Date(item.created_at).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            ),
        },
        {
            key: 'kasir',
            label: 'Kasir',
            render: (item: Transaction) => (
                <span className="font-medium text-slate-700">
                    {item.nama_kasir || item.kasir?.nama_lengkap || 'Unknown'}
                </span>
            ),
        },
        {
            key: 'metode_bayar',
            label: 'Metode bayar',
            render: (item: Transaction) => (
                <span className="font-medium text-slate-700 uppercase">
                    {item.metode_bayar || 'Unknown'}
                </span>
            ),
        },
        {
            key: 'total',
            label: 'Total',
            render: (item: Transaction) => (
                <span className="font-bold text-[#ef5350]">
                    {formatRupiah(item.subtotal)}
                </span>
            ),
        },
        {
            key: 'actions',
            label: 'Aksi',
            className: 'text-right',
            render: (item: Transaction) => (
                <div className="flex justify-end">
                    <Link
                        href={route('transaksi.show', item.id_transaksi)}
                        className="text-xs font-semibold text-[#ef5350] transition-colors hover:text-red-700 hover:underline"
                    >
                        Lihat
                    </Link>
                </div>
            ),
        },
    ];

    const applyFilters = (
        type: 'daily' | 'monthly' | 'period',
        start: string,
        end: string,
    ) => {
        router.get(
            route('transaksi.history'),
            {
                search: search, // Keep current search
                per_page: filters.per_page,
                filter_type: type,
                start_date: start,
                end_date: end,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleFilterTypeChange = (type: 'daily' | 'monthly' | 'period') => {
        setFilterType(type);
        filterTypeRef.current = type;
    };

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        applyFilters(filterTypeRef.current, start, end);
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;

        // Check for client-side page anchor
        if (url.startsWith('#page=')) {
            const page = parseInt(url.split('=')[1]);
            if (!isNaN(page)) {
                setCurrentPage(page);
                return;
            }
        }
    };

    // Custom wrapper for handles
    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handlePerPageChange = (val: number) => {
        setPerPage(val);
        setCurrentPage(1);
    };

    return (
        <MainLayout onSearch={handleSearch} searchValue={search}>
            <Head title="Riwayat Transaksi" />

            <div className="mb-6">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    Riwayat Transaksi
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    Daftar semua transaksi yang telah dilakukan.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <SummaryCard
                    title="Total Transaksi"
                    value={transactions.total_transactions}
                    icon={ShoppingCart}
                    gradient="from-blue-500 to-blue-600"
                />
                <SummaryCard
                    title="Total Omset"
                    value={formatRupiah(transactions.total_revenue)}
                    icon={Banknote}
                    gradient="from-purple-500 to-purple-600"
                />
            </div>

            {/* Filter Section */}
            <DateFilter
                filterType={filterType}
                startDate={startDate}
                endDate={endDate}
                onFilterTypeChange={handleFilterTypeChange}
                onDateChange={handleDateChange}
                className="mb-6"
            />

            <DataTable
                columns={columns}
                data={paginatedData}
                meta={paginationMeta as any}
                filters={{ search, per_page: perPage }}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />
        </MainLayout>
    );
}
