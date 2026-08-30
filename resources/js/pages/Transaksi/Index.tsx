import { useState, useEffect, useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/Produk/ProductCard';
import CartPanel from '@/Components/Transaction/CartPanel';
import { Head, router, usePage } from '@inertiajs/react';
import { useToast } from '@/Components/Core/Toast';
import TransactionReceipt from '@/Components/Transaction/TransactionReceipt';
import CategoryFilter from '@/Components/Core/CategoryFilter';

interface CartItem {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar?: string;
    quantity: number;
}

interface Product {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar?: string;
    kategori: string | null;
    is_active: boolean;
}

export default function Transaksi({ products }: { products: Product[] }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    // Extract categories
    const categories = useMemo(() => {
        return Array.from(
            new Set(products.map((p) => p.kategori).filter(Boolean)),
        ) as string[];
    }, [products]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.nama_produk
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = selectedCategory
            ? product.kategori === selectedCategory
            : true;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        setCart((prev) => {
            // ... existing addToCart logic
            const existing = prev.find(
                (item) => item.id_produk === product.id_produk,
            );
            if (existing) {
                return prev.map((item) =>
                    item.id_produk === product.id_produk
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };
    // ... existing updateQuantity, clearCart, useToast, etc.
    const updateQuantity = (id_produk: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id_produk === id_produk) {
                        return { ...item, quantity: item.quantity + delta };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0),
        );
    };

    const clearCart = () => setCart([]);

    const { success, error } = useToast();
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);
    const { auth, flash } = usePage<any>().props;

    const [paymentKey, setPaymentKey] = useState(0);

    useEffect(() => {
        if (flash?.receipt) {
            // ... existing receipt logic
            const r = flash.receipt;
            const enrichedItems = (r.items || []).map((item: any) => {
                const product = products.find(
                    (p) => p.id_produk === item.id_produk,
                );
                return {
                    ...item,
                    nama_produk: product
                        ? product.nama_produk
                        : 'Unknown Product',
                    harga_jual: product ? product.harga_jual : 0,
                    quantity: item.qty,
                };
            });

            setReceiptData({
                nomor_faktur: r.nomor_faktur,
                tanggal: r.tanggal,
                waktu: r.waktu,
                kasir: auth.user.nama_lengkap,
                items: enrichedItems,
                subtotal: r.subtotal,
                tax: 0,
                total: r.subtotal,
                bayar: r.subtotal + r.kembalian,
                kembalian: r.kembalian,
                metode_bayar: r.metode_bayar || 'cash',
            });
            setIsReceiptOpen(true);
            // Removed clearCart() here. It happens on close.
        }
    }, [flash, products]);

    const handleCloseReceipt = () => {
        setIsReceiptOpen(false);
        success('Transaksi berhasil!');
        clearCart();
        setPaymentKey((prev) => prev + 1); // Reset payment section
    };

    const handlePayment = (method: 'cash' | 'qris', cashAmount?: number) => {
        if (method === 'qris') {
            router.get(route('transaksi.qris'), {
                cart: JSON.stringify(cart),
                total: cart.reduce(
                    (sum, item) => sum + item.harga_jual * item.quantity,
                    0,
                ),
            });
            return;
        }

        router.post(
            '/transaksi',
            {
                items: cart.map((item) => ({
                    id_produk: item.id_produk,
                    qty: item.quantity,
                })),
                jumlah_bayar: cashAmount || 0,
                kategori: 'takeaway',
                metode_bayar: method,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled in handleCloseReceipt now
                },
                onError: (errors) => {
                    console.error(errors);
                    error('Gagal memproses transaksi.');
                },
            },
        );
    };

    return (
        <MainLayout
            onSearch={setSearch}
            searchValue={search}
            noPadding
            hideFooter
        >
            <Head title="Transaksi" />

            <TransactionReceipt
                isOpen={isReceiptOpen}
                onClose={handleCloseReceipt}
                data={receiptData}
            />

            <div className="flex h-full min-h-0 flex-1 flex-col gap-4 p-4 pt-1 md:gap-6 md:p-6 md:pt-0 lg:flex-row lg:pt-0 overflow-hidden">
                {/* Product Grid */}
                <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto pb-24 lg:pr-2 lg:pb-4">
                    {categories.length > 0 && (
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                            className="mb-6"
                        />
                    )}

                    {filteredProducts.length === 0 ? (
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
                    ) : (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id_produk}
                                    product={product}
                                    onClick={() => addToCart(product)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Sidebar (Cart) */}
                <CartPanel
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onClearCart={clearCart}
                    onProcessPayment={handlePayment}
                    paymentKey={paymentKey}
                />
            </div>
        </MainLayout>
    );
}
