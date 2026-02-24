import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import PegawaiForm from '@/Components/Pegawai/PegawaiForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

export default function PegawaiCreate() {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Pegawai" />
            <div className="mx-auto max-w-full">
                {search ? <SearchUnavailable /> : <PegawaiForm />}
            </div>
        </MainLayout>
    );
}
