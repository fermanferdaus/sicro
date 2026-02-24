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

interface GajiEditProps {
    gaji: Gaji;
    pegawai: Pegawai[];
}

export default function GajiEdit({ gaji, pegawai }: GajiEditProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Edit Pengaturan Gaji" />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <GajiForm gaji={gaji} pegawaiList={pegawai} isEdit />
                )}
            </div>
        </MainLayout>
    );
}
