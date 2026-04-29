import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, Check, Clock, Filter } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import DataTable from '@/Components/Core/DataTable';
import { formatRupiah } from '@/lib/utils';
import ModalHapus from '@/Components/Core/ModalHapus';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import TableAction from '@/Components/Core/TableAction';
import MonthFilter from '@/Components/Core/MonthFilter';

interface Pegawai {
    id_pegawai: string;
    id_user: string | null;
    nama_lengkap: string;
}

interface Bonus {
    id_bonus: string;
    id_pegawai: string;
    judul: string;
    jumlah: number;
    keterangan: string;
    periode: string;
    status: 'pending' | 'disetujui';
    pegawai?: {
        id_user: string;
        kode_pegawai: string;
        nama_lengkap: string;
    };
}

interface BonusIndexProps {
    bonus: Bonus[];
    filters: {
        search?: string;
        month?: string | number;
        year?: string | number;
    };
}

export default function BonusIndex({ bonus, filters }: BonusIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [month, setMonth] = useState(
        filters?.month || new Date().getMonth() + 1,
    );
    const [year, setYear] = useState(filters?.year || new Date().getFullYear());
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Bonus | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    // Edit Confirmation State
    const [isEditing, setIsEditing] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Bonus | null>(null);

    // Tambah Confirmation State
    const [showTambahModal, setShowTambahModal] = useState(false);

    // Status Confirmation State
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [itemToToggle, setItemToToggle] = useState<Bonus | null>(null);

    // Filter effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                route('bonus.index'),
                { search, month, year },
                { preserveState: true, replace: true },
            );
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, month, year]);

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Bonus, idx: number) => (
                <span className="text-slate-600">{from + idx + 1}</span>
            ),
            className: 'text-center w-10',
        },
        {
            key: 'kode_pegawai',
            label: 'ID Pegawai',
            render: (item: Bonus) => (
                <span className="text-xs font-semibold text-slate-500">
                    {item.pegawai?.kode_pegawai}
                </span>
            ),
            className: 'w-24',
        },
        {
            key: 'pegawai',
            label: 'Pegawai',
            render: (item: Bonus) => (
                <div className="font-bold text-slate-900">
                    {item.pegawai?.nama_lengkap}
                </div>
            ),
        },
        {
            key: 'judul',
            label: 'Judul Bonus',
            render: (item: Bonus) => (
                <div className="text-slate-700">{item.judul}</div>
            ),
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            render: (item: Bonus) => (
                <span className="font-bold text-slate-900">
                    {formatRupiah(item.jumlah)}
                </span>
            ),
        },
        {
            key: 'keterangan',
            label: 'Keterangan',
            render: (item: Bonus) => (
                <div className="text-slate-700">{item.keterangan}</div>
            ),
        },
        {
            key: 'periode',
            label: 'Periode',
            render: (item: Bonus) => {
                const [y, m] = item.periode.split('-');
                const monthNames = [
                    'Januari',
                    'Februari',
                    'Maret',
                    'April',
                    'Mei',
                    'Juni',
                    'Juli',
                    'Agustus',
                    'September',
                    'Oktober',
                    'November',
                    'Desember',
                ];
                return (
                    <span className="text-sm font-medium text-slate-600">
                        {monthNames[parseInt(m) - 1]} {y}
                    </span>
                );
            },
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: Bonus) => (
                <button
                    onClick={() => {
                        setItemToToggle(item);
                        setShowStatusModal(true);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                        item.status === 'disetujui'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    }`}
                >
                    {item.status === 'disetujui' ? (
                        <>
                            <Check className="h-3 w-3" />
                            Disetujui
                        </>
                    ) : (
                        <>
                            <Clock className="h-3 w-3" />
                            Pending
                        </>
                    )}
                </button>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Bonus) => (
                <TableAction
                    onEdit={() => {
                        setItemToEdit(item);
                        setIsEditing(true);
                    }}
                    onDelete={() => {
                        setItemToDelete(item);
                        setIsDeleting(true);
                    }}
                />
            ),
            className: 'w-24',
        },
    ];

    const handleToggleStatus = () => {
        if (!itemToToggle) return;
        const newStatus =
            itemToToggle.status === 'pending' ? 'disetujui' : 'pending';
        router.patch(
            route('bonus.update-status', itemToToggle.id_bonus),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowStatusModal(false);
                    setItemToToggle(null);
                },
            },
        );
    };

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route('bonus.destroy', itemToDelete.id_bonus), {
            onStart: () => setIsProcessingDelete(true),
            onFinish: () => {
                setIsProcessingDelete(false);
                setIsDeleting(false);
                setItemToDelete(null);
            },
        });
    };

    // Client-side pagination logic (actual backend pagination would be better but keeping consistency with GajiIndex)
    const filteredData = bonus; // Filtered by backend now
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

    const links = [];
    links.push({
        url: currentPage > 1 ? `#page=${currentPage - 1}` : null,
        label: '&laquo; Previous',
        active: false,
    });
    for (let i = 1; i <= lastPage; i++) {
        links.push({
            url: `#page=${i}`,
            label: i.toString(),
            active: i === currentPage,
        });
    }
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
        total: filteredData.length,
    };

    return (
        <MainLayout searchValue={search} onSearch={setSearch}>
            <Head title="Manajemen Bonus" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manajemen Bonus
                    </h1>
                    <p className="text-sm text-slate-500">
                        Kelola bonus pegawai dan pantau status persetujuan
                    </p>
                </div>

                <PrimaryButton
                    onClick={() => setShowTambahModal(true)}
                    className="flex w-fit items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Bonus
                </PrimaryButton>
            </div>

            {/* Filter Section using Reusable Component */}
            <MonthFilter
                value={`${year}-${month.toString().padStart(2, '0')}`}
                onChange={(val) => {
                    if (val) {
                        const [y, m] = val.split('-');
                        setYear(parseInt(y));
                        setMonth(parseInt(m));
                    }
                }}
                className="mb-6"
            />

            <DataTable
                columns={columns}
                data={paginatedData}
                meta={paginationMeta as any}
                filters={{ search, per_page: perPage }}
                onPageChange={handlePageChange}
                onPerPageChange={(val) => {
                    setPerPage(val);
                    setCurrentPage(1);
                }}
            />

            <ModalHapus
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleDelete}
                title="Hapus Bonus"
                description={`Apakah Anda yakin ingin menghapus bonus "${itemToDelete?.judul}" untuk "${itemToDelete?.pegawai?.nama_lengkap}"?`}
                isProcessing={isProcessingDelete}
            />

            <ModalKonfirmasi
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onConfirm={() => {
                    if (itemToEdit) {
                        router.get(route('bonus.edit', itemToEdit.id_bonus));
                    }
                }}
                title="Edit Data Bonus"
                description={`Apakah Anda yakin ingin mengedit bonus "${itemToEdit?.judul}" untuk "${itemToEdit?.pegawai?.nama_lengkap}"?`}
                confirmText="Edit"
            />

            <ModalKonfirmasi
                isOpen={showTambahModal}
                onClose={() => setShowTambahModal(false)}
                onConfirm={() => router.get(route('bonus.create'))}
                title="Tambah Bonus Baru"
                description="Apakah Anda yakin ingin menambahkan bonus baru?"
                confirmText="Tambah"
            />

            <ModalKonfirmasi
                isOpen={showStatusModal}
                onClose={() => {
                    setShowStatusModal(false);
                    setItemToToggle(null);
                }}
                onConfirm={handleToggleStatus}
                title={
                    itemToToggle?.status === 'pending'
                        ? 'Setujui Bonus'
                        : 'Batalkan Persetujuan'
                }
                description={
                    itemToToggle?.status === 'pending'
                        ? `Apakah Anda yakin ingin menyetujui bonus "${itemToToggle?.judul}" untuk "${itemToToggle?.pegawai?.nama_lengkap}"?`
                        : `Apakah Anda yakin ingin membatalkan persetujuan bonus "${itemToToggle?.judul}" untuk "${itemToToggle?.pegawai?.nama_lengkap}"?`
                }
                confirmText={
                    itemToToggle?.status === 'pending' ? 'Setujui' : 'Batalkan'
                }
            />
        </MainLayout>
    );
}
