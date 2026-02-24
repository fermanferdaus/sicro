import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useAuth from '@/Hooks/useAuth';
import DataTable from '@/Components/Core/DataTable';
import ModalHapus from '@/Components/Core/ModalHapus';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, User } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import TableAction from '@/Components/Core/TableAction';

interface UserAccount {
    id_user: string;
    username: string;
    nama_lengkap: string;
    email: string;
    role: string;
}

interface Pegawai {
    id_pegawai: string;
    id_user: string | null;
    kode_pegawai: string;
    nama_lengkap: string;
    email: string | null;
    alamat: string;
    nomor_telepon: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
}

interface PegawaiIndexProps {
    pegawai: Pegawai[];
    filters: {
        search?: string;
    };
}

export default function PegawaiIndex({ pegawai, filters }: PegawaiIndexProps) {
    const { isOwner } = useAuth();
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Pegawai | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Pegawai, idx: number) => (
                <span className="text-slate-600">{from + idx + 1}</span>
            ),
            className: 'text-center w-10',
        },
        {
            key: 'kode_pegawai',
            label: 'ID Pegawai',
            render: (item: Pegawai) => (
                <span className="text-xs font-semibold text-slate-500">
                    {item.kode_pegawai}
                </span>
            ),
            className: 'w-24',
        },
        {
            key: 'nama_lengkap',
            label: 'Nama Lengkap',
            render: (item: Pegawai) => (
                <div className="font-bold text-slate-900">
                    {item.nama_lengkap}
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (item: Pegawai) => (
                <span className="font-medium text-slate-600">
                    {item.email || '-'}
                </span>
            ),
        },
        {
            key: 'nomor_telepon',
            label: 'No Telepon',
            render: (item: Pegawai) => (
                <span className="text-slate-600">
                    {item.nomor_telepon || '-'}
                </span>
            ),
        },
        {
            key: 'tanggal_lahir',
            label: 'Tanggal Lahir',
            render: (item: Pegawai) => (
                <span className="text-slate-600">
                    {item.tanggal_lahir || '-'}
                </span>
            ),
        },
        {
            key: 'jenis_kelamin',
            label: 'L/P',
            render: (item: Pegawai) => (
                <span className="text-slate-600">{item.jenis_kelamin}</span>
            ),
            className: 'text-center',
        },
        {
            key: 'alamat',
            label: 'Alamat',
            render: (item: Pegawai) => (
                <span className="text-slate-600">{item.alamat || '-'}</span>
            ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Pegawai) => (
                <TableAction
                    onEdit={() =>
                        router.get(route('pegawai.edit', item.id_pegawai))
                    }
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

        router.delete(route('pegawai.destroy', itemToDelete.id_pegawai), {
            onStart: () => setIsProcessingDelete(true),
            onFinish: () => {
                setIsProcessingDelete(false);
                setIsDeleting(false);
                setItemToDelete(null);
            },
        });
    };

    const filteredData = pegawai.filter(
        (item) =>
            item.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
            item.email?.toLowerCase().includes(search.toLowerCase()) ||
            item.kode_pegawai?.toLowerCase().includes(search.toLowerCase()),
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
            <Head title="Data Pegawai" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Data Pegawai
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manajemen informasi dan akun pegawai toko
                    </p>
                </div>

                <PrimaryButton
                    onClick={() => router.get(route('pegawai.create'))}
                    className="flex w-fit items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Pegawai
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
                title="Hapus Pegawai"
                description={`Apakah Anda yakin ingin menghapus data pegawai "${itemToDelete?.nama_lengkap}"?`}
                isProcessing={isProcessingDelete}
            />
        </MainLayout>
    );
}
