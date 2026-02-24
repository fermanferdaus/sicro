import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import BonusForm from '@/Components/Bonus/BonusForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

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

interface BonusEditProps {
    bonus: Bonus;
    pegawai: Pegawai[];
}

export default function BonusEdit({ bonus, pegawai }: BonusEditProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Edit Bonus" />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <BonusForm bonus={bonus} pegawaiList={pegawai} isEdit />
                )}
            </div>
        </MainLayout>
    );
}
