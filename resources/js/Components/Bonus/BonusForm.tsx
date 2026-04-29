import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import TextArea from '@/Components/Form/TextArea';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { ArrowLeft } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';

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
        nama_lengkap: string;
    };
}

interface BonusFormProps {
    bonus?: Bonus;
    pegawaiList: Pegawai[];
    isEdit?: boolean;
}

export default function BonusForm({
    bonus,
    pegawaiList,
    isEdit = false,
}: BonusFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        id_pegawai: bonus?.id_pegawai || '',
        judul: bonus?.judul || '',
        jumlah: bonus?.jumlah || 0,
        keterangan: bonus?.keterangan || '',
        periode: bonus?.periode || new Date().toISOString().substring(0, 7), // YYYY-MM
    });

    // State untuk pencarian pegawai
    const [searchPegawai, setSearchPegawai] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const [showKonfirmasi, setShowKonfirmasi] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowKonfirmasi(true);
    };

    const handleConfirm = () => {
        if (isEdit) {
            put(route('bonus.update', bonus?.id_bonus), {
                onSuccess: () => setShowKonfirmasi(false),
            });
        } else {
            post(route('bonus.store'), {
                onSuccess: () => setShowKonfirmasi(false),
            });
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('jumlah', Number(value));
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('bonus.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Bonus' : 'Tambah Bonus Baru'}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={submit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pilih Pegawai */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="id_pegawai" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Pilih Pegawai{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-left text-sm text-slate-700 focus:border-[#ef5350] focus:ring-1 focus:ring-[#ef5350] focus:outline-none disabled:bg-slate-50"
                                onClick={() =>
                                    !isEdit && setDropdownOpen((v) => !v)
                                }
                                disabled={isEdit}
                            >
                                {data.id_pegawai
                                    ? pegawaiList.find(
                                          (p) =>
                                              p.id_pegawai === data.id_pegawai,
                                      )?.nama_lengkap || 'Pilih Pegawai'
                                    : 'Pilih Pegawai'}
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
                                        {pegawaiList.filter(
                                            (p) =>
                                                !searchPegawai ||
                                                p.nama_lengkap
                                                    .toLowerCase()
                                                    .includes(
                                                        searchPegawai.toLowerCase(),
                                                    ),
                                        ).length === 0 && (
                                            <div className="px-4 py-2 text-sm text-slate-400">
                                                Tidak ada pegawai ditemukan
                                            </div>
                                        )}
                                        {pegawaiList
                                            .filter(
                                                (p) =>
                                                    !searchPegawai ||
                                                    p.nama_lengkap
                                                        .toLowerCase()
                                                        .includes(
                                                            searchPegawai.toLowerCase(),
                                                        ),
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
                                                    {p.nama_lengkap}
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
                    </div>

                    {/* Judul Bonus */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="judul" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Judul Bonus{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="judul"
                            type="text"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            placeholder="Misal: Bonus Target Bulanan"
                            className="w-full"
                            required
                        />
                        {errors.judul && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.judul}
                            </p>
                        )}
                    </div>

                    {/* Jumlah Bonus */}
                    <div>
                        <InputLabel htmlFor="jumlah" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Jumlah Bonus{' '}
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

                    {/* Periode */}
                    <div>
                        <InputLabel htmlFor="periode" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Periode <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="periode"
                            type="month"
                            value={data.periode}
                            onChange={(e) => setData('periode', e.target.value)}
                            required
                        />
                        {errors.periode && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.periode}
                            </p>
                        )}
                    </div>

                    {/* Keterangan */}
                    <div className="md:col-span-2">
                        <InputLabel htmlFor="keterangan" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Keterangan{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextArea
                            id="keterangan"
                            value={data.keterangan}
                            onChange={(e) =>
                                setData('keterangan', e.target.value)
                            }
                            placeholder="Tuliskan keterangan bonus..."
                            rows={3}
                            required
                        />
                        {errors.keterangan && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.keterangan}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('bonus.index'))}
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
                        isEdit ? 'Simpan Perubahan Bonus' : 'Tambah Bonus Baru'
                    }
                    description={
                        isEdit
                            ? 'Apakah Anda yakin ingin menyimpan perubahan pada data bonus pegawai ini?'
                            : 'Apakah Anda yakin ingin menambahkan bonus baru ini?'
                    }
                    isProcessing={processing}
                />
            </form>
        </div>
    );
}
