import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import AccountForm, { Pegawai } from '@/Components/Account/AccountForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

interface Account {
    id_user: string;
    username: string;
    nama_lengkap: string;
    email: string;
    role: 'owner' | 'kasir';
    pegawai?: Pegawai | null;
}

interface EditAccountProps {
    account: Account;
    pegawai: Pegawai[];
}

export default function EditAccount({ account, pegawai }: EditAccountProps) {
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Edit Akun" />

            <div className="mx-auto max-w-full">
                {search ? (
                    <SearchUnavailable />
                ) : (
                    <AccountForm
                        account={account}
                        pegawai={pegawai}
                        isEdit={true}
                    />
                )}
            </div>
        </MainLayout>
    );
}
