import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductForm from '@/Components/Produk/ProductForm';
import { useState } from 'react';
import SearchUnavailable from '@/Components/Core/SearchUnavailable';

interface Props {
    produk: {
        id_produk: string;
        nama_produk: string;
        harga_jual: number;
        gambar: string | null;
        kategori: string | null;
        is_active: boolean;
    };
}

export default function Edit({ produk }: Props) {
    const [search, setSearch] = useState('');

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Edit Produk" />

            <div>
                <div className="w-full">
                    {search ? (
                        <SearchUnavailable />
                    ) : (
                        <ProductForm produk={produk} isEdit={true} />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
