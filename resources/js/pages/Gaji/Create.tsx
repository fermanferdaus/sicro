import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import GajiForm from '@/Components/Gaji/GajiForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

interface Pegawai {
    id_pegawai: string;
    id_user: string | null;
    nama_lengkap: string;
}

interface GajiCreateProps {
    pegawai: Pegawai[];
}

export default function GajiCreate({ pegawai }: GajiCreateProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Pengaturan Gaji" />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <GajiForm pegawaiList={pegawai} />
                )}
            </div>
        </MainLayout>
    );
}
