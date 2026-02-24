import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import SelectInput from '@/Components/Form/SelectInput';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

export interface Pegawai {
    id_pegawai: string;
    kode_pegawai: string;
    nama_lengkap: string;
    email: string | null;
    id_user: string | null;
}

interface Account {
    id_user: string;
    username: string;
    nama_lengkap: string;
    email: string;
    role: 'owner' | 'kasir';
    pegawai?: Pegawai | null;
}

interface AccountFormProps {
    account?: Account;
    pegawai: Pegawai[];
    isEdit?: boolean;
}

export default function AccountForm({
    account,
    pegawai,
    isEdit = false,
}: AccountFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        username: account?.username || '',
        nama_lengkap: account?.nama_lengkap || '',
        email: account?.email || '',
        password: '',
        role: account?.role || 'kasir',
        id_pegawai: account?.pegawai?.id_pegawai || '',
        _method: isEdit ? 'PUT' : 'POST',
    });

    // State untuk pencarian pegawai
    const [searchPegawai, setSearchPegawai] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle initial state and updates
    useEffect(() => {
        if (!isEdit && data.id_pegawai) {
            const selected = pegawai.find(
                (p) => p.id_pegawai === data.id_pegawai,
            );
            if (selected) {
                setData((d) => ({
                    ...d,
                    nama_lengkap: selected.nama_lengkap,
                    email: selected.email || d.email,
                }));
            }
        }
    }, [data.id_pegawai]);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route('account.update', account?.id_user)
            : route('account.store');

        post(url);
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('account.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="role" className="mb-1.5">
                            Hak Akses <span className="text-red-500">*</span>
                        </InputLabel>
                        <SelectInput
                            id="role"
                            value={data.role}
                            onChange={(e) =>
                                setData(
                                    'role',
                                    e.target.value as 'owner' | 'kasir',
                                )
                            }
                            options={[
                                {
                                    value: 'kasir',
                                    label: 'Kasir',
                                },
                                {
                                    value: 'owner',
                                    label: 'Owner',
                                },
                            ]}
                            className="w-full"
                        />
                        {errors.role && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.role}
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <InputLabel htmlFor="id_pegawai" className="mb-1.5">
                            Tautkan Data Pegawai{' '}
                            {data.role !== 'owner' && (
                                <span className="text-red-500">*</span>
                            )}
                        </InputLabel>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-700 focus:border-[#ef5350] focus:ring-1 focus:ring-[#ef5350] focus:outline-none"
                                onClick={() => setDropdownOpen((v) => !v)}
                            >
                                {data.id_pegawai
                                    ? (() => {
                                          const p = pegawai.find(
                                              (p) =>
                                                  p.id_pegawai ===
                                                  data.id_pegawai,
                                          );
                                          return p
                                              ? p.nama_lengkap
                                              : 'Pilih Pegawai untuk Sinkron Data';
                                      })()
                                    : 'Pilih Pegawai untuk Sinkron Data'}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                                    <input
                                        type="text"
                                        className="w-full border-0 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-700 focus:border-[#ef5350] focus:ring-0 focus:outline-none"
                                        placeholder="Cari nama pegawai..."
                                        value={searchPegawai}
                                        onChange={(e) =>
                                            setSearchPegawai(e.target.value)
                                        }
                                        autoFocus
                                    />
                                    <div className="max-h-56 overflow-y-auto">
                                        {pegawai.filter(
                                            (p) =>
                                                (!searchPegawai ||
                                                    p.nama_lengkap
                                                        .toLowerCase()
                                                        .includes(
                                                            searchPegawai.toLowerCase(),
                                                        )) &&
                                                (!p.id_user || // Changed from !p.email to !p.id_user
                                                    (isEdit &&
                                                        account?.pegawai
                                                            ?.id_pegawai ===
                                                            p.id_pegawai)),
                                        ).length === 0 && (
                                            <div className="px-4 py-2 text-sm text-slate-400">
                                                Tidak ada pegawai ditemukan atau
                                                sudah memiliki akun
                                            </div>
                                        )}
                                        {pegawai
                                            .filter(
                                                (p) =>
                                                    (!searchPegawai ||
                                                        p.nama_lengkap
                                                            .toLowerCase()
                                                            .includes(
                                                                searchPegawai.toLowerCase(),
                                                            ) ||
                                                        p.kode_pegawai
                                                            ?.toLowerCase()
                                                            .includes(
                                                                searchPegawai.toLowerCase(),
                                                            )) &&
                                                    // Hanya tampilkan pegawai yang belum punya akun,
                                                    // atau pegawai yang sedang diedit ini
                                                    (!p.id_user ||
                                                        (isEdit &&
                                                            account?.pegawai
                                                                ?.id_pegawai ===
                                                                p.id_pegawai)),
                                            )
                                            .map((p) => (
                                                <button
                                                    type="button"
                                                    key={p.id_pegawai}
                                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 ${data.id_pegawai === p.id_pegawai ? 'bg-slate-100 font-bold' : ''}`}
                                                    onClick={() => {
                                                        setData(
                                                            'id_pegawai',
                                                            p.id_pegawai,
                                                        );
                                                        setDropdownOpen(false);
                                                        setSearchPegawai('');
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="underline-offset-2">
                                                            {p.nama_lengkap}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.id_pegawai && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.id_pegawai}
                            </p>
                        )}
                        <p className="mt-2 text-[10px] text-slate-400">
                            * Sinkron data akan otomatis mengisi Nama Lengkap
                            dan Email dari data pegawai yang dipilih.
                        </p>
                    </div>

                    <div>
                        <InputLabel htmlFor="nama_lengkap" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Nama Lengkap{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="nama_lengkap"
                            type="text"
                            value={data.nama_lengkap}
                            onChange={(e) =>
                                setData('nama_lengkap', e.target.value)
                            }
                            placeholder="Nama sesuai KTP"
                            className="w-full"
                            required
                        />
                        {errors.nama_lengkap && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nama_lengkap}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="username" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Username <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="username"
                            type="text"
                            value={data.username}
                            onChange={(e) =>
                                setData('username', e.target.value)
                            }
                            placeholder="Contoh: budi_kasir"
                            className="w-full"
                            required
                        />
                        {errors.username && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="email" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Email <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="budi@example.com"
                            className="w-full"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <InputLabel htmlFor="password" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Password{' '}
                                {!isEdit && (
                                    <span className="text-red-500">*</span>
                                )}
                            </div>
                        </InputLabel>
                        <TextInput
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={
                                isEdit
                                    ? 'Kosongkan jika tidak diubah'
                                    : 'Minimal 8 karakter'
                            }
                            className="w-full"
                            required={!isEdit}
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('account.index'))}
                        className="bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                        Batal
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={processing}
                        className="px-8"
                        type="submit"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
