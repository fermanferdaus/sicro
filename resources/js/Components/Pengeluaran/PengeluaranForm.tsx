import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import ImageUpload from '@/Components/Form/ImageUpload';
import SelectInput from '@/Components/Form/SelectInput';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import { useState } from 'react';

interface Pengeluaran {
    id_pengeluaran: string;
    judul: string;
    kategori: string;
    deskripsi: string;
    jumlah: number;
    bukti_path: string | null;
    tanggal: string;
}

interface PengeluaranFormProps {
    pengeluaran?: Pengeluaran;
    isEdit?: boolean;
}

export default function PengeluaranForm({
    pengeluaran,
    isEdit = false,
}: PengeluaranFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        judul: pengeluaran?.judul || '',
        kategori: pengeluaran?.kategori || '',
        deskripsi: pengeluaran?.deskripsi || '',
        jumlah: pengeluaran?.jumlah || 0,
        tanggal: pengeluaran?.tanggal || new Date().toISOString().split('T')[0],
        bukti_path: null as File | string | null,
        _method: isEdit ? 'PUT' : 'POST',
    });

    const [showKonfirmasi, setShowKonfirmasi] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            setShowKonfirmasi(true);
            return;
        }

        post(route('pengeluaran.store'), {
            forceFormData: true,
        });
    };

    const handleConfirmEdit = () => {
        post(route('pengeluaran.update', pengeluaran?.id_pengeluaran), {
            forceFormData: true,
            onSuccess: () => setShowKonfirmasi(false),
        });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setData('jumlah', Number(value));
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('pengeluaran.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                {/* Image Upload Component at the top - same as ProductForm */}
                <ImageUpload
                    label={
                        <div className="flex items-center gap-1">
                            Bukti Pembayaran{' '}
                            {!isEdit && <span className="text-red-500">*</span>}
                        </div>
                    }
                    image={
                        data.bukti_path ||
                        (isEdit ? pengeluaran?.bukti_path || null : null)
                    }
                    onChange={(file) => setData('bukti_path', file)}
                    error={errors.bukti_path}
                    className="mb-8"
                />

                {/* Form Fields Grid - single column like ProductForm */}
                <div className="grid gap-6">
                    {/* Judul */}
                    <div>
                        <InputLabel htmlFor="judul" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Judul Pengeluaran{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="judul"
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            placeholder="Contoh: Pembelian Bahan Baku"
                            isFocused={!isEdit}
                            className="w-full"
                            required
                        />
                        {errors.judul && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.judul}
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
                        <SelectInput
                            id="kategori"
                            value={data.kategori}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                            ) => setData('kategori', e.target.value)}
                            options={[
                                { value: 'Bahan Baku', label: 'Bahan Baku' },
                                { value: 'Operasional', label: 'Operasional' },
                                { value: 'Inventaris', label: 'Inventaris' },
                                { value: 'Sewa Tempat', label: 'Sewa Tempat' },
                                { value: 'Lain-lain', label: 'Lain-lain' },
                            ]}
                            placeholder="Pilih Kategori"
                            className="w-full"
                            required
                        />
                        {errors.kategori && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.kategori}
                            </p>
                        )}
                    </div>

                    {/* Row for Amount and Date */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {/* Jumlah */}
                        <div>
                            <InputLabel htmlFor="jumlah" className="mb-1.5">
                                <div className="flex items-center gap-1">
                                    Jumlah{' '}
                                    <span className="text-red-500">*</span>
                                </div>
                            </InputLabel>
                            <TextInput
                                id="jumlah"
                                type="text"
                                value={formatRupiah(data.jumlah)}
                                onChange={handleAmountChange}
                                placeholder="Rp 0"
                                className="w-full"
                                required
                            />
                            {errors.jumlah && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.jumlah}
                                </p>
                            )}
                        </div>

                        {/* Tanggal */}
                        <div>
                            <InputLabel htmlFor="tanggal" className="mb-1.5">
                                <div className="flex items-center gap-1">
                                    Tanggal{' '}
                                    <span className="text-red-500">*</span>
                                </div>
                            </InputLabel>
                            <TextInput
                                id="tanggal"
                                type="date"
                                value={data.tanggal}
                                onChange={(e) =>
                                    setData('tanggal', e.target.value)
                                }
                                className="w-full"
                                required
                            />
                            {errors.tanggal && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.tanggal}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <InputLabel
                            htmlFor="deskripsi"
                            value="Deskripsi"
                            className="mb-1.5"
                        />
                        <TextArea
                            id="deskripsi"
                            value={data.deskripsi}
                            onChange={(e) =>
                                setData('deskripsi', e.target.value)
                            }
                            placeholder="Jelaskan detail pengeluaran..."
                            className="h-32"
                        />
                        {errors.deskripsi && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.deskripsi}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('pengeluaran.index'))}
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
                    onConfirm={handleConfirmEdit}
                    title="Simpan Perubahan Pengeluaran"
                    description="Apakah Anda yakin ingin menyimpan perubahan pada data pengeluaran ini?"
                    isProcessing={processing}
                />
            </form>
        </div>
    );
}
