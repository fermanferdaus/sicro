import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SummaryCard from '@/Components/Core/SummaryCard';
import ModalHapus from '@/Components/Core/ModalHapus';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';
import ProductCard from '@/Components/Produk/ProductCard';
import CategoryFilter from '@/Components/Core/CategoryFilter';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { Plus, Package } from 'lucide-react';

interface Produk {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar: string | null;
    kategori: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    produk: Produk[];
    total_produk: number;
    filters: {
        search?: string;
    };
}

export default function Index({ produk, total_produk, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    // Extract unique categories
    const categories = useMemo(() => {
        return Array.from(
            new Set(produk.map((p) => p.kategori).filter(Boolean)),
        ) as string[];
    }, [produk]);

    // Client-side filtering
    const filteredProducts = produk.filter((item) => {
        const matchesSearch = item.nama_produk
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = selectedCategory
            ? item.kategori === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    // Modal Hapus State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Produk | null>(null);

    // Tambah Confirmation State
    const [showTambahModal, setShowTambahModal] = useState(false);

    // No server-side search effect needed

    const openDeleteModal = (item: Produk) => {
        setProductToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            router.delete(route('produk.destroy', productToDelete.id_produk), {
                preserveScroll: true,
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setProductToDelete(null);
                },
            });
        }
    };

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Produk" />

            <ModalHapus
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Produk"
                description={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.nama_produk}"? Tindakan ini tidak dapat dibatalkan.`}
            />

            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Produk
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Kelola daftar produk anda disini.
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <PrimaryButton
                        onClick={() => setShowTambahModal(true)}
                        className="w-fit gap-2 font-bold"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Produk
                    </PrimaryButton>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Total Produk"
                    value={total_produk}
                    icon={Package}
                    gradient="from-green-500 to-green-600"
                />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    className="mb-6"
                />
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredProducts.map((item) => (
                        <ProductCard
                            key={item.id_produk}
                            product={item}
                            mode="admin"
                            onDelete={(p) =>
                                openDeleteModal(p as unknown as Produk)
                            }
                        />
                    ))}
                </div>
            ) : (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <span className="material-icons text-5xl">
                            inventory_2
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                        Produk Tidak Ditemukan
                    </h3>
                    <p className="mt-2 text-slate-500">
                        {search
                            ? `Tidak ada produk yang cocok dengan pencarian "${search}"`
                            : 'Belum ada produk yang tersedia di toko ini.'}
                    </p>
                </div>
            )}

            <ModalKonfirmasi
                isOpen={showTambahModal}
                onClose={() => setShowTambahModal(false)}
                onConfirm={() => router.get(route('produk.create'))}
                title="Tambah Produk Baru"
                description="Apakah Anda yakin ingin menambahkan produk baru?"
                confirmText="Tambah"
            />
        </MainLayout>
    );
}
