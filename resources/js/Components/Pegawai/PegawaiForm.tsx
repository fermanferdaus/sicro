import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import SelectInput from '@/Components/Form/SelectInput';
import { ArrowLeft } from 'lucide-react';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { useState } from 'react';

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
    nama_lengkap: string;
    email: string | null;
    alamat: string;
    nomor_telepon: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    user?: UserAccount;
}

interface PegawaiFormProps {
    pegawai?: Pegawai;
    isEdit?: boolean;
}

export default function PegawaiForm({
    pegawai,
    isEdit = false,
}: PegawaiFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: pegawai?.nama_lengkap || '',
        email: pegawai?.email || '',
        alamat: pegawai?.alamat || '',
        nomor_telepon: pegawai?.nomor_telepon || '',
        tanggal_lahir: pegawai?.tanggal_lahir || '',
        jenis_kelamin: pegawai?.jenis_kelamin || 'L',
        _method: isEdit ? 'PUT' : 'POST',
    });

    const [showKonfirmasi, setShowKonfirmasi] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowKonfirmasi(true);
    };

    const handleConfirm = () => {
        const url = isEdit
            ? route('pegawai.update', pegawai?.id_pegawai)
            : route('pegawai.store');

        post(url, {
            forceFormData: true,
            onSuccess: () => setShowKonfirmasi(false),
        });
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('pegawai.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                {/* Komponen upload foto dihapus */}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Nama Lengkap */}
                    <div className="md:col-span-2">
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
                            placeholder="Contoh: Budi Santoso"
                            className="w-full"
                            required
                        />
                        {errors.nama_lengkap && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nama_lengkap}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" className="mb-1.5">
                            Email
                        </InputLabel>
                        <TextInput
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="budi@example.com"
                            className="w-full"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Nomor Telepon */}
                    <div>
                        <InputLabel htmlFor="nomor_telepon" className="mb-1.5">
                            Nomor Telepon
                        </InputLabel>
                        <TextInput
                            id="nomor_telepon"
                            type="text"
                            value={data.nomor_telepon}
                            onChange={(e) =>
                                setData('nomor_telepon', e.target.value)
                            }
                            placeholder="0812xxxx"
                            className="w-full"
                        />
                        {errors.nomor_telepon && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nomor_telepon}
                            </p>
                        )}
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                        <InputLabel htmlFor="jenis_kelamin" className="mb-1.5">
                            Jenis Kelamin
                        </InputLabel>
                        <SelectInput
                            id="jenis_kelamin"
                            value={data.jenis_kelamin}
                            onChange={(e) =>
                                setData(
                                    'jenis_kelamin',
                                    e.target.value as 'L' | 'P',
                                )
                            }
                            options={[
                                { value: 'L', label: 'Laki-laki' },
                                { value: 'P', label: 'Perempuan' },
                            ]}
                            className="w-full"
                        />
                        {errors.jenis_kelamin && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.jenis_kelamin}
                            </p>
                        )}
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                        <InputLabel htmlFor="tanggal_lahir" className="mb-1.5">
                            Tanggal Lahir
                        </InputLabel>
                        <TextInput
                            id="tanggal_lahir"
                            type="date"
                            value={data.tanggal_lahir}
                            onChange={(e) =>
                                setData('tanggal_lahir', e.target.value)
                            }
                            className="w-full"
                        />
                        {errors.tanggal_lahir && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.tanggal_lahir}
                            </p>
                        )}
                    </div>

                    {/* Alamat */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="alamat" className="mb-1.5">
                            Alamat Lengkap
                        </InputLabel>
                        <TextArea
                            id="alamat"
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            placeholder="Alamat domisili saat ini"
                            className="h-32"
                        />
                        {errors.alamat && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.alamat}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('pegawai.index'))}
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

                <ModalKonfirmasi
                    isOpen={showKonfirmasi}
                    onClose={() => setShowKonfirmasi(false)}
                    onConfirm={handleConfirm}
                    title={
                        isEdit
                            ? 'Simpan Perubahan Pegawai'
                            : 'Tambah Pegawai Baru'
                    }
                    description={
                        isEdit
                            ? 'Apakah Anda yakin ingin menyimpan perubahan pada data pegawai ini?'
                            : 'Apakah Anda yakin ingin menambahkan data pegawai baru ini?'
                    }
                    isProcessing={processing}
                />
            </form>
        </div>
    );
}
