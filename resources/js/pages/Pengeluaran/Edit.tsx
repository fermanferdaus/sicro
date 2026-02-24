import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PengeluaranForm from '@/Components/Pengeluaran/PengeluaranForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

interface Pengeluaran {
    id_pengeluaran: string;
    judul: string;
    kategori: string;
    deskripsi: string;
    jumlah: number;
    bukti_path: string | null;
    tanggal: string;
}

interface Props {
    pengeluaran: Pengeluaran;
}

export default function Edit({ pengeluaran }: Props) {
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Edit Pengeluaran" />

            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <PengeluaranForm pengeluaran={pengeluaran} isEdit={true} />
                )}
            </div>
        </MainLayout>
    );
}
