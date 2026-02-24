import { useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/Form/InputLabel';
import TextInput from '@/Components/Form/TextInput';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import SelectInput from '@/Components/Form/SelectInput';
import { ArrowLeft } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface Pegawai {
    id_pegawai: string;
    id_user: string | null;
    nama_lengkap: string;
}

interface Gaji {
    id_gaji: string;
    id_pegawai: string;
    gaji_pokok: number;
    tipe_gaji: 'harian' | 'mingguan' | 'bulanan';
    pegawai?: {
        id_user: string;
        nama_lengkap: string;
    };
}

interface GajiFormProps {
    gaji?: Gaji;
    pegawaiList: Pegawai[];
    isEdit?: boolean;
}

export default function GajiForm({
    gaji,
    pegawaiList,
    isEdit = false,
}: GajiFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        id_pegawai: gaji?.id_pegawai || '',
        gaji_pokok: gaji?.gaji_pokok || 0,
        tipe_gaji: gaji?.tipe_gaji || 'bulanan',
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

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEdit
            ? route('gaji.update', gaji?.id_gaji)
            : route('gaji.store');

        if (isEdit) {
            put(url);
        } else {
            post(url);
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setData('gaji_pokok', Number(value));
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <Link
                        href={route('gaji.index')}
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#ef5350]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEdit ? 'Edit Pengaturan Gaji' : 'Atur Gaji Baru'}
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

                    {/* Jenis Gaji */}
                    <div>
                        <InputLabel htmlFor="tipe_gaji" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Jenis Gaji{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <SelectInput
                            id="tipe_gaji"
                            value={data.tipe_gaji}
                            onChange={(e) =>
                                setData('tipe_gaji', e.target.value as any)
                            }
                            className="w-full"
                            options={[
                                { value: 'harian', label: 'Harian' },
                                { value: 'mingguan', label: 'Mingguan' },
                                { value: 'bulanan', label: 'Bulanan' },
                            ]}
                            required
                        />
                        {errors.tipe_gaji && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.tipe_gaji}
                            </p>
                        )}
                    </div>

                    {/* Gaji Pokok */}
                    <div>
                        <InputLabel htmlFor="gaji_pokok" className="mb-1.5">
                            <div className="flex items-center gap-1">
                                Gaji Pokok{' '}
                                <span className="text-red-500">*</span>
                            </div>
                        </InputLabel>
                        <TextInput
                            id="gaji_pokok"
                            type="text"
                            value={formatRupiah(data.gaji_pokok)}
                            onChange={handleAmountChange}
                            placeholder="Rp 0"
                            className="w-full"
                            required
                        />
                        {errors.gaji_pokok && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.gaji_pokok}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <PrimaryButton
                        type="button"
                        onClick={() => router.get(route('gaji.index'))}
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
