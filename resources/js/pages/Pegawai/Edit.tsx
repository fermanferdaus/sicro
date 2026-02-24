import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import PegawaiForm from '@/Components/Pegawai/PegawaiForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';
interface Pegawai {
    id_pegawai: string;
    id_user: string | null;
    nama_lengkap: string;
    email: string | null;
    alamat: string;
    nomor_telepon: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    foto_path: string | null;
}

interface PegawaiEditProps {
    pegawai: Pegawai;
}

export default function PegawaiEdit({ pegawai }: PegawaiEditProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title={`Edit Pegawai - ${pegawai.nama_lengkap}`} />
            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <PegawaiForm pegawai={pegawai} isEdit />
                )}
            </div>
        </MainLayout>
    );
}
