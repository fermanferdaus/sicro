import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import ImageUpload from '@/Components/Form/ImageUpload';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';
import { FormEventHandler } from 'react';
import { Store, MapPin, Phone, Instagram, Music2 } from 'lucide-react';

interface ProfilProps {
    profil_data: {
        id_profil: string;
        nama_store: string;
        alamat: string;
        nama_owner: string;
        logo: string;
        telepon: string;
        instagram: string;
        tiktok: string;
    };
}

export default function ProfilIndex({ profil_data }: ProfilProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'POST', // Use POST for multipart/form-data
        nama_store: profil_data?.nama_store || '',
        alamat: profil_data?.alamat || '',
        nama_owner: profil_data?.nama_owner || '',
        logo: null as File | string | null,
        telepon: profil_data?.telepon || '',
        instagram: profil_data?.instagram || '',
        tiktok: profil_data?.tiktok || '',
        delete_logo: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profil.update'), {
            onSuccess: () => {
                // router.reload();
            },
        });
    };

    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Profil Toko" />

            <div className="w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <>
                        <div className="mb-4">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Profil Toko
                            </h1>
                            <p className="text-sm text-slate-500">
                                Kelola informasi publik toko Anda
                            </p>
                        </div>

                        <form
                            onSubmit={submit}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <ImageUpload
                                label="Logo Toko"
                                image={
                                    data.logo ||
                                    (profil_data?.logo && !data.delete_logo
                                        ? profil_data.logo
                                        : null)
                                }
                                onChange={(file) => {
                                    setData((previousData) => ({
                                        ...previousData,
                                        logo: file,
                                        delete_logo:
                                            file === null &&
                                            !!profil_data?.logo,
                                    }));
                                }}
                                error={errors.logo}
                                className="mb-8"
                            />

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {/* Informasi Dasar */}
                                <div className="space-y-6">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                        <Store className="h-5 w-5 text-[#ef5350]" />
                                        Informasi Dasar
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="nama_store"
                                                value="Nama Toko"
                                                className="mb-1.5"
                                            />
                                            <TextInput
                                                id="nama_store"
                                                value={data.nama_store}
                                                onChange={(e) =>
                                                    setData(
                                                        'nama_store',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full"
                                                placeholder="Contoh: Sicro"
                                            />
                                            {errors.nama_store && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.nama_store}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="nama_owner"
                                                value="Nama Pemilik"
                                                className="mb-1.5"
                                            />
                                            <TextInput
                                                id="nama_owner"
                                                value={data.nama_owner}
                                                onChange={(e) =>
                                                    setData(
                                                        'nama_owner',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full"
                                                placeholder="Nama Lengkap Pemilik"
                                            />
                                            {errors.nama_owner && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.nama_owner}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="alamat"
                                                value="Alamat Lengkap"
                                                className="mb-1.5"
                                            />
                                            <div className="relative">
                                                <div className="absolute top-3 left-0 flex items-start pl-3">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <TextArea
                                                    id="alamat"
                                                    value={data.alamat}
                                                    onChange={(e) =>
                                                        setData(
                                                            'alamat',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full pl-10"
                                                    rows={4}
                                                    placeholder="Jl. Pagar Alam No. 123, Bandar Lampung"
                                                />
                                            </div>
                                            {errors.alamat && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.alamat}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Kontak & Media Sosial */}
                                <div className="space-y-6">
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                        <Phone className="h-5 w-5 text-[#ef5350]" />
                                        Kontak & Sosial Media
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="telepon"
                                                value="Nomor Telepon"
                                                className="mb-1.5"
                                            />
                                            <TextInput
                                                id="telepon"
                                                value={data.telepon}
                                                onChange={(e) =>
                                                    setData(
                                                        'telepon',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full"
                                                placeholder="08123456789"
                                            />
                                            {errors.telepon && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.telepon}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="instagram"
                                                value="Instagram (Opsional)"
                                                className="mb-1.5"
                                            />
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Instagram className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <TextInput
                                                    id="instagram"
                                                    value={data.instagram}
                                                    onChange={(e) =>
                                                        setData(
                                                            'instagram',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full pl-10"
                                                    placeholder="sicro.official"
                                                />
                                            </div>
                                            {errors.instagram && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.instagram}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="tiktok"
                                                value="TikTok (Opsional)"
                                                className="mb-1.5"
                                            />
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                    <Music2 className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <TextInput
                                                    id="tiktok"
                                                    value={data.tiktok}
                                                    onChange={(e) =>
                                                        setData(
                                                            'tiktok',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full pl-10"
                                                    placeholder="sicro.official"
                                                />
                                            </div>
                                            {errors.tiktok && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {errors.tiktok}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                                <PrimaryButton
                                    type="button"
                                    onClick={() =>
                                        router.visit(route('dashboard'))
                                    }
                                    className="bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Batal
                                </PrimaryButton>
                                <PrimaryButton
                                    disabled={processing}
                                    className="px-8 capitalize"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
