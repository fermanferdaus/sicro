import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductForm from '@/Components/Produk/ProductForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

export default function Create() {
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Tambah Produk" />

            <div>
                <div className="w-full">
                    {search ? <SearchUnavailable /> : <ProductForm />}
                </div>
            </div>
        </MainLayout>
    );
}
