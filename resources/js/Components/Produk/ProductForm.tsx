import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import ImageUpload from '@/Components/Form/ImageUpload';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { useState } from 'react';
import { useToast } from '@/Components/Core/Toast';

interface ProductFormProps {
    produk?: {
        id_produk: string;
        nama_produk: string;
        harga_jual: number;
        gambar: string | null;
        kategori: string | null;
        is_active: boolean;
    };
    isEdit?: boolean;
}

export default function ProductForm({
    produk,
    isEdit = false,
}: ProductFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        nama_produk: produk?.nama_produk || '',
        harga_jual: produk?.harga_jual || 0,
        kategori: produk?.kategori || '',
        is_active: produk?.is_active ?? true,
        gambar: (produk?.gambar || null) as File | string | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const [showKonfirmasi, setShowKonfirmasi] = useState(false);
    const { error: showErrorToast } = useToast();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowKonfirmasi(true);
    };

    const handleConfirm = () => {
        const url = isEdit
            ? route('produk.update', produk?.id_produk)
            : route('produk.store');

        post(url, {
            onSuccess: () => setShowKonfirmasi(false),
            onError: (errs) => {
                setShowKonfirmasi(false);
                if (errs.nama_produk) {
                    showErrorToast(errs.nama_produk);
                } else {
                    showErrorToast('Gagal menyimpan produk. Periksa kembali input Anda.');
                }
            },
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setData('harga_jual', Number(value));
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('produk.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk'}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                {/* Image Upload Component */}
                <ImageUpload
                    label="Gambar Produk"
                    image={data.gambar}
                    onChange={(file) => setData('gambar', file)}
                    error={errors.gambar}
                    className="mb-8"
                />

                {/* Form Fields Grid */}
                <div className="grid gap-6">
                    {/* Nama Produk */}
                    <div>
                        <InputLabel htmlFor="nama_produk" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Nama Produk{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="nama_produk"
                            type="text"
                            value={data.nama_produk}
                            onChange={(e) =>
                                setData('nama_produk', e.target.value)
                            }
                            placeholder="Contoh: Chicken Crunchy Roll"
                            isFocused={!isEdit}
                            className="w-full"
                            required
                        />
                        {errors.nama_produk && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.nama_produk}
                            </p>
                        )}
                    </div>

                    {/* Kategori */}
                    <div>
                        <InputLabel htmlFor="kategori" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Kategori <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="kategori"
                            type="text"
                            value={data.kategori}
                            onChange={(e) =>
                                setData('kategori', e.target.value)
                            }
                            placeholder="Contoh: Main Course, Best Seller"
                            className="w-full"
                            required
                        />
                        {errors.kategori && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.kategori}
                            </p>
                        )}
                    </div>

                    {/* Harga Jual */}
                    <div>
                        <InputLabel htmlFor="harga_jual" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Harga Jual{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="harga_jual"
                            type="text"
                            value={formatRupiah(data.harga_jual)}
                            onChange={handlePriceChange}
                            placeholder="Rp 0"
                            className="w-full"
                            required
                        />
                        {errors.harga_jual && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.harga_jual}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('produk.index'))}
                        className="bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                    >
                        Batal
                    </PrimaryButton>
                    <PrimaryButton disabled={processing} className="px-8">
                        {processing
                            ? 'Menyimpan...'
                            : isEdit
                              ? 'Simpan'
                              : 'Simpan'}
                    </PrimaryButton>
                </div>

                <ModalKonfirmasi
                    isOpen={showKonfirmasi}
                    onClose={() => setShowKonfirmasi(false)}
                    onConfirm={handleConfirm}
                    title={
                        isEdit
                            ? 'Simpan Perubahan Produk'
                            : 'Tambah Produk Baru'
                    }
                    description={
                        isEdit
                            ? 'Apakah Anda yakin ingin menyimpan perubahan pada data produk ini?'
                            : 'Apakah Anda yakin ingin menambahkan produk baru ini?'
                    }
                    isProcessing={processing}
                />
            </form>
        </div>
    );
}
