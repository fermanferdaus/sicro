import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import DataTable from '@/Components/Core/DataTable';
import { formatRupiah } from '@/lib/utils';
import ModalHapus from '@/Components/Core/ModalHapus';
import TableAction from '@/Components/Core/TableAction';

interface User {
    id_user: string;
    kode_pegawai: string;
    nama_lengkap: string;
    username: string;
}

interface Gaji {
    id_gaji: string;
    id_pegawai: string;
    gaji_pokok: number;
    tipe_gaji: 'harian' | 'mingguan' | 'bulanan';
    pegawai?: User;
}

interface GajiIndexProps {
    gaji: Gaji[];
    filters: {
        search?: string;
    };
}

export default function GajiIndex({ gaji, filters = {} }: GajiIndexProps) {
    const [search, setSearch] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Gaji | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Gaji, idx: number) => (
                <span className="text-slate-600">{from + idx + 1}</span>
            ),
            className: 'text-center w-10',
        },
        {
            key: 'kode_pegawai',
            label: 'ID Pegawai',
            render: (item: Gaji) => (
                <span className="text-xs font-semibold text-slate-500">
                    {item.pegawai?.kode_pegawai}
                </span>
            ),
            className: 'w-24',
        },
        {
            key: 'nama',
            label: 'Nama Pegawai',
            render: (item: Gaji) => (
                <div className="font-bold text-slate-900">
                    {item.pegawai?.nama_lengkap}
                </div>
            ),
        },
        {
            key: 'tipe_gaji',
            label: 'Jenis Gaji',
            render: (item: Gaji) => (
                <span className="font-medium text-slate-600 capitalize">
                    {item.tipe_gaji}
                </span>
            ),
        },
        {
            key: 'gaji_pokok',
            label: 'Gaji Pokok',
            render: (item: Gaji) => (
                <span className="font-bold text-slate-900">
                    {formatRupiah(item.gaji_pokok)}
                </span>
            ),
        },
        {
            key: 'estimasi_bulanan',
            label: 'Estimasi Per Bulan',
            render: (item: Gaji) => {
                const daysInMonth = new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    0,
                ).getDate();
                let estimasi = 0;
                if (item.tipe_gaji === 'harian')
                    estimasi = item.gaji_pokok * daysInMonth;
                else if (item.tipe_gaji === 'mingguan')
                    estimasi = item.gaji_pokok * 4;
                else estimasi = item.gaji_pokok;

                return (
                    <span className="font-bold text-[#ef5350]">
                        {formatRupiah(estimasi)}
                    </span>
                );
            },
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Gaji) => (
                <TableAction
                    onEdit={() => router.get(route('gaji.edit', item.id_gaji))}
                    onDelete={() => {
                        setItemToDelete(item);
                        setIsDeleting(true);
                    }}
                />
            ),
            className: 'w-24',
        },
    ];

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route('gaji.destroy', itemToDelete.id_gaji), {
            onStart: () => setIsProcessingDelete(true),
            onFinish: () => {
                setIsProcessingDelete(false);
                setIsDeleting(false);
                setItemToDelete(null);
            },
        });
    };

    const filteredData = gaji.filter(
        (item) =>
            item.pegawai?.nama_lengkap
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            item.pegawai?.kode_pegawai
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            item.tipe_gaji.toLowerCase().includes(search.toLowerCase()),
    );

    const lastPage = Math.ceil(filteredData.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredData.length);
    const paginatedData = filteredData.slice(from, to);

    // Generate Pagination Links for client-side pagination
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

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        if (url.startsWith('#page=')) {
            const page = parseInt(url.split('=')[1]);
            if (!isNaN(page)) setCurrentPage(page);
        }
    };

    return (
        <MainLayout
            searchValue={search}
            onSearch={(val) => {
                setSearch(val);
                setCurrentPage(1);
            }}
        >
            <Head title="Manajemen Gaji" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manajemen Gaji
                    </h1>
                    <p className="text-sm text-slate-500">
                        Atur standar gaji harian, mingguan, atau bulanan pegawai
                    </p>
                </div>

                <PrimaryButton
                    onClick={() => router.get(route('gaji.create'))}
                    className="flex w-fit items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Atur Gaji
                </PrimaryButton>
            </div>

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
                title="Hapus Pengaturan Gaji"
                description={`Apakah Anda yakin ingin menghapus pengaturan gaji untuk "${itemToDelete?.pegawai?.nama_lengkap}"?`}
                isProcessing={isProcessingDelete}
            />
        </MainLayout>
    );
}
