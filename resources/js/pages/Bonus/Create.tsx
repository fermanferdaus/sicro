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

interface BonusCreateProps {
    pegawai: Pegawai[];
}

export default function BonusCreate({ pegawai }: BonusCreateProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Bonus" />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <BonusForm pegawaiList={pegawai} />
                )}
            </div>
        </MainLayout>
    );
}
