import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import AccountForm, { Pegawai } from '@/Components/Account/AccountForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

interface CreateAccountProps {
    pegawai: Pegawai[];
}

export default function CreateAccount({ pegawai }: CreateAccountProps) {
    const [search, setSearch] = useState('');
    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Akun" />

            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <AccountForm pegawai={pegawai} />
                )}
            </div>
        </MainLayout>
    );
}
