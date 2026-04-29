import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import TextInput from '@/Components/Form/TextInput';
import InputLabel from '@/Components/Form/InputLabel';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import ImageUpload from '@/Components/Form/ImageUpload';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { FormEventHandler, useState, useEffect } from 'react';

export default function Setting() {
    const { auth } = usePage<any>().props;
    const user = auth.user;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: 'PUT',
        username: user.username,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        password: '',
        password_confirmation: '',
        foto_profile: (user.foto_profile || null) as File | string | null,
        delete_foto_profile: false,
    });

    const [showKonfirmasi, setShowKonfirmasi] = useState(false);

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            foto_profile: user.foto_profile || null,
            delete_foto_profile: false,
        }));
    }, [user.foto_profile]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setShowKonfirmasi(true);
    };

    const handleConfirmSave = () => {
        post(route('setting.update'), {
            onSuccess: () => {
                setShowKonfirmasi(false);
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Setting Profile" />

            <div className="w-full">
                {/* Header Section */}
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Pengaturan Akun
                        </h1>
                    </div>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={submit}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    {/* Image Upload Component */}
                    <ImageUpload
                        label="Foto Profil"
                        image={data.foto_profile}
                        onChange={(file) => {
                            setData((previousData) => ({
                                ...previousData,
                                foto_profile: file,
                                delete_foto_profile:
                                    file === null && !!user.foto_profile,
                            }));
                        }}
                        error={errors.foto_profile}
                        className="mb-8"
                    />

                    {/* Form Fields Grid */}
                    <div className="grid gap-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel
                                    htmlFor="nama_lengkap"
                                    value="Nama Lengkap"
                                    className="mb-1.5"
                                />
                                <TextInput
                                    id="nama_lengkap"
                                    value={data.nama_lengkap}
                                    onChange={(e) =>
                                        setData('nama_lengkap', e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="John Doe"
                                />
                                {errors.nama_lengkap && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.nama_lengkap}
                                    </p>
                                )}
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="username"
                                    value="Username"
                                    className="mb-1.5"
                                />
                                <TextInput
                                    id="username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData('username', e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="johndoe"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.username}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Alamat Email"
                                className="mb-1.5"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="w-full"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Section */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="mb-4 text-base font-medium text-slate-900">
                                Update Password
                            </h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password Baru"
                                        className="mb-1.5"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full"
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                        className="mb-1.5"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full"
                                        placeholder="••••••••"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                        <PrimaryButton
                            type="button"
                            onClick={() => router.visit(route('dashboard'))}
                            className="bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                        >
                            Batal
                        </PrimaryButton>
                        <PrimaryButton disabled={processing} className="px-8">
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </PrimaryButton>
                    </div>

                    <ModalKonfirmasi
                        isOpen={showKonfirmasi}
                        onClose={() => setShowKonfirmasi(false)}
                        onConfirm={handleConfirmSave}
                        title="Simpan Pengaturan Akun"
                        description="Apakah Anda yakin ingin menyimpan perubahan pada pengaturan akun Anda?"
                        isProcessing={processing}
                    />
                </form>
            </div>
        </MainLayout>
    );
}
