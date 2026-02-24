import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PengeluaranForm from '@/Components/Pengeluaran/PengeluaranForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

export default function Create() {
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Pengeluaran" />

            <div className="mx-auto max-w-full">
                {search ? <SearchUnavailable /> : <PengeluaranForm />}
            </div>
        </MainLayout>
    );
}
