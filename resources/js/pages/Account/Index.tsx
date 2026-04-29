import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import DataTable from '@/Components/Core/DataTable';
import ModalHapus from '@/Components/Core/ModalHapus';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { Head, router } from '@inertiajs/react';
import { Plus, User, ShieldCheck } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import TableAction from '@/Components/Core/TableAction';

interface Pegawai {
    id_pegawai: string;
    nama_lengkap: string;
}

interface Account {
    foto_profile: string | undefined;
    id_user: string;
    username: string;
    nama_lengkap: string;
    email: string;
    role: string;
    pegawai?: Pegawai | null;
}

interface AccountIndexProps {
    accounts: Account[];
    filters: {
        search?: string;
    };
}

export default function AccountIndex({ accounts, filters }: AccountIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Account | null>(null);
    const [isProcessingDelete, setIsProcessingDelete] = useState(false);

    // Edit Confirmation State
    const [isEditing, setIsEditing] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Account | null>(null);

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Account, idx: number) => (
                <span className="text-slate-600">{from + idx + 1}</span>
            ),
            className: 'text-center w-10',
        },
        {
            key: 'account',
            label: 'Akun Pengguna',
            render: (item: Account) => (
                <div className="flex items-center gap-3">
                    {item.foto_profile ? (
                        <img
                            src={item.foto_profile}
                            alt={item.nama_lengkap}
                            className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ef5350] text-base font-bold text-white uppercase select-none">
                            {item.nama_lengkap
                                ? item.nama_lengkap
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')
                                      .slice(0, 2)
                                : ''}
                        </div>
                    )}
                    <div>
                        <div className="font-bold text-slate-900">
                            {item.nama_lengkap}
                        </div>
                        <div className="text-xs text-slate-500">
                            @{item.username}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (item: Account) => (
                <span className="font-medium text-slate-600">{item.email}</span>
            ),
        },
        {
            key: 'role',
            label: 'Hak Akses',
            render: (item: Account) => (
                <div className="flex items-center gap-1.5">
                    {item.role === 'owner' ? (
                        <ShieldCheck className="h-4 w-4 text-amber-500" />
                    ) : (
                        <User className="h-4 w-4 text-blue-500" />
                    )}
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                            item.role === 'owner'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-blue-100 text-blue-600'
                        }`}
                    >
                        {item.role}
                    </span>
                </div>
            ),
        },
        {
            key: 'pegawai',
            label: 'Tautan Pegawai',
            render: (item: Account) =>
                item.pegawai ? (
                    <div className="text-xs">
                        <span className="font-medium text-slate-700">
                            {item.pegawai.nama_lengkap}
                        </span>
                        <div className="text-[10px] text-slate-400">
                            Terhubung
                        </div>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400">-</span>
                ),
        },
        {
            key: 'aksi',
            label: 'Aksi',
            render: (item: Account) => (
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

    const handleDelete = () => {
        if (!itemToDelete) return;

        router.delete(route('account.destroy', itemToDelete.id_user), {
            onStart: () => setIsProcessingDelete(true),
            onFinish: () => {
                setIsProcessingDelete(false);
                setIsDeleting(false);
                setItemToDelete(null);
            },
        });
    };

    const filteredData = accounts.filter(
        (item) =>
            item.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase()),
    );

    const lastPage = Math.ceil(filteredData.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredData.length);
    const paginatedData = filteredData.slice(from, to);

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
            <Head title="Manajemen Akun" />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manajemen Akun
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manajemen akun akses sistem
                    </p>
                </div>

                <PrimaryButton
                    onClick={() => router.get(route('account.create'))}
                    className="flex w-fit items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Akun
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
                title="Hapus Akun"
                description={`Apakah Anda yakin ingin menghapus akun "${itemToDelete?.username}"? Tindakan ini akan mencabut akses sistem untuk pengguna ini.`}
                isProcessing={isProcessingDelete}
            />

            <ModalKonfirmasi
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                onConfirm={() => {
                    if (itemToEdit) {
                        router.get(route('account.edit', itemToEdit.id_user));
                    }
                }}
                title="Edit Akun Pengguna"
                description={`Apakah Anda yakin ingin mengedit akun "${itemToEdit?.username}"?`}
                confirmText="Edit"
            />
        </MainLayout>
    );
}
