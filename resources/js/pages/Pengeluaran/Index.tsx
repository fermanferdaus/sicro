import { useState, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useAuth from '@/Hooks/useAuth';
import DataTable from '@/Components/Core/DataTable';
import ModalHapus from '@/Components/Core/ModalHapus';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { Head, Link, router } from '@inertiajs/react';
import { formatRupiah, formatDateLong } from '@/lib/utils';
import { Plus } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import TableAction from '@/Components/Core/TableAction';
import DateFilter from '@/Components/Core/DateFilter';
import CategoryFilter from '@/Components/Core/CategoryFilter';
import SummaryCard from '@/Components/Core/SummaryCard';
import { TrendingDown } from 'lucide-react';

interface Pengeluaran {
    id_pengeluaran: string;
    judul: string;
    kategori: string;
    deskripsi: string;
    jumlah: number;
    bukti_path: string | null;
    tanggal: string;
}

interface PengeluaranIndexProps {
    pengeluaran: Pengeluaran[];
    categories: string[];
    filters: {
        kategori?: string;
        filter_type?: 'daily' | 'monthly' | 'period';
        start_date?: string;
        end_date?: string;
    };
}

export default function PengeluaranIndex({
    pengeluaran,
    categories,
    filters,
}: PengeluaranIndexProps) {
    const { isOwner } = useAuth();
    const [search, setSearch] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        filters.kategori || null,
    );
    const [filterType, setFilterType] = useState<
        'daily' | 'monthly' | 'period'
    >(filters.filter_type || 'monthly');
    const filterTypeRef = useRef(filterType);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');

    const applyFilters = (
        type: 'daily' | 'monthly' | 'period',
        start: string,
        end: string,
        category: string | null,
    ) => {
        router.get(
            route('pengeluaran.index'),
            {
                filter_type: type,
                start_date: start,
                end_date: end,
                kategori: category || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleCategoryChange = (val: string | null) => {
        setSelectedCategory(val);
        applyFilters(filterType, startDate, endDate, val);
    };

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        applyFilters(filterTypeRef.current, start, end, selectedCategory);
    };

    const handleFilterTypeChange = (type: 'daily' | 'monthly' | 'period') => {
        setFilterType(type);
        filterTypeRef.current = type;
    };

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Pengeluaran | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    // Edit Confirmation State
    const [isEditing, setIsEditing] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Pengeluaran | null>(null);

    // Filter Logic
    const filteredData = pengeluaran.filter(
        (item) =>
            item.judul.toLowerCase().includes(search.toLowerCase()) ||
            item.kategori.toLowerCase().includes(search.toLowerCase()),
    );

    const totalPengeluaran = filteredData.reduce(
        (acc, item) => acc + item.jumlah,
        0,
    );

    // Pagination Logic
    const lastPage = Math.ceil(filteredData.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredData.length);
    const paginatedData = filteredData.slice(from, to);

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        if (url.startsWith('#page=')) {
            const page = parseInt(url.split('=')[1]);
            if (!isNaN(page)) setCurrentPage(page);
        }
    };

    const handleDeleteClick = (item: Pengeluaran) => {
        setItemToDelete(item);
        setIsDeleting(true);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        setIsProcessingDelete(true);
        router.delete(
            route('pengeluaran.destroy', itemToDelete.id_pengeluaran),
            {
                onSuccess: () => {
                    setIsDeleting(false);
                    setItemToDelete(null);
                    setIsProcessingDelete(false);
                },
                onError: () => {
                    setIsProcessingDelete(false);
                },
            },
        );
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_: any, index: number) => from + index + 1,
        },
        {
            key: 'judul',
            label: 'Judul',
            render: (item: Pengeluaran) => (
                <span className="font-bold">{item.judul}</span>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
        },
        {
            key: 'deskripsi',
            label: 'Deskripsi',
            render: (item: Pengeluaran) => (
                <span
                    className="block max-w-xs truncate"
                    title={item.deskripsi || ''}
                >
                    {item.deskripsi || '-'}
                </span>
            ),
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            render: (item: Pengeluaran) => (
                <span className="font-bold">{formatRupiah(item.jumlah)}</span>
            ),
            className: 'text-right',
        },
        {
            key: 'bukti',
            label: 'Bukti',
            render: (item: Pengeluaran) =>
                item.bukti_path ? (
                    <div className="flex justify-center">
                        <a
                            href={item.bukti_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-[#ef5350] transition-colors hover:text-red-700 hover:underline"
                        >
                            Lihat
                        </a>
                    </div>
                ) : (
                    <span className="text-slate-400 italic">Tidak ada</span>
                ),
            className: 'text-center',
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (item: Pengeluaran) => formatDateLong(item.tanggal),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Pengeluaran) => (
                <TableAction
                    onEdit={() => {
                        setItemToEdit(item);
                        setIsEditing(true);
                    }}
                    onDelete={() => handleDeleteClick(item)}
                />
            ),
            className: 'text-center',
        },
    ];

    if (!isOwner) {
        return (
            <MainLayout>
                <div className="flex min-h-[50vh] flex-col items-center justify-center">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Akses Ditolak
                    </h1>
                    <p className="text-slate-500">
                        Hanya owner yang dapat mengakses halaman ini.
                    </p>
                    <Link
                        href="/dashboard"
                        className="mt-4 text-blue-600 hover:underline"
                    >
                        Kembali ke Dashboard
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Data Pengeluaran" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Data Pengeluaran
                    </h1>
                    <p className="text-slate-500">
                        Daftar pengeluaran operasional toko
                    </p>
                </div>
                <PrimaryButton
                    onClick={() => router.get(route('pengeluaran.create'))}
                    className="w-fit gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Pengeluaran
                </PrimaryButton>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <SummaryCard
                    title="Total Pengeluaran"
                    value={formatRupiah(totalPengeluaran)}
                    icon={TrendingDown}
                    gradient="from-red-500 to-red-600"
                />
            </div>

            <div className="mb-6 flex flex-col gap-6">
                <DateFilter
                    filterType={filterType}
                    startDate={startDate}
                    endDate={endDate}
                    onFilterTypeChange={handleFilterTypeChange}
                    onDateChange={handleDateChange}
                />

                {categories.length > 0 && (
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                )}
            </div>

            <DataTable
                columns={columns}
                data={paginatedData}
                meta={{
                    current_page: currentPage,
                    last_page: lastPage,
                    from: from + 1,
                    to: to,
                    total: filteredData.length,
                    per_page: perPage,
                    links: [], // Simplified local pagination
                    path: '',
                }}
                filters={{ search, per_page: perPage }}
                onPageChange={handlePageChange}
                onSearch={setSearch}
                onPerPageChange={(val) => {
                    setPerPage(val);
                    setCurrentPage(1);
                }}
            />

            <ModalHapus
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={confirmDelete}
                title="Hapus Pengeluaran"
                description={`Apakah Anda yakin ingin menghapus data pengeluaran "${itemToDelete?.judul}"?`}
                isProcessing={isProcessingDelete}
            />

            <ModalKonfirmasi
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onConfirm={() => {
                    if (itemToEdit) {
                        router.get(route('pengeluaran.edit', itemToEdit.id_pengeluaran));
                    }
                }}
                title="Edit Data Pengeluaran"
                description={`Apakah Anda yakin ingin mengedit data pengeluaran "${itemToEdit?.judul}"?`}
                confirmText="Edit"
            />
        </MainLayout>
    );
}
