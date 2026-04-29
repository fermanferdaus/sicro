import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { cn, formatRupiah } from '@/lib/utils';
import { Switch } from '@headlessui/react';
import TableAction from '@/Components/Core/TableAction';
import ModalKonfirmasi from '@/Components/Core/ModalKonfirmasi';

interface Product {
    id_produk: string;
    nama_produk: string;
    harga_jual: number;
    gambar?: string | null;
    kategori: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface ProductCardProps {
    product: Product;
    mode?: 'admin' | 'pos';
    onDelete?: (product: Product) => void;
    onClick?: () => void;
}

export default function ProductCard({
    product,
    mode = 'pos',
    onDelete,
    onClick,
}: ProductCardProps) {
    const [isArchived, setIsArchived] = useState(!product.is_active);
    const [showEditConfirm, setShowEditConfirm] = useState(false);

    // Sync state with props in case the parent component (Inertia) reloads the data
    useEffect(() => {
        setIsArchived(!product.is_active);
    }, [product.is_active]);

    const toggleStatus = (checked: boolean) => {
        setIsArchived(checked);
        router.post(
            route('produk.update', product.id_produk),
            {
                _method: 'PUT',
                is_active: !checked,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div
            onClick={mode === 'pos' ? onClick : undefined}
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
                mode === 'pos' && 'cursor-pointer active:scale-95',
            )}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                {/* Category Badge */}
                {product.kategori && (
                    <div className="absolute top-2 left-2 z-10 rounded-md bg-[#ef5350] px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm backdrop-blur-sm">
                        {product.kategori}
                    </div>
                )}

                {/* HIDDEN Overlay (Admin Only) */}
                {mode === 'admin' && isArchived && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
                        <span className="rounded-md bg-slate-800/80 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                            DIARSIPKAN
                        </span>
                    </div>
                )}

                {product.gambar ? (
                    <img
                        src={product.gambar}
                        alt={product.nama_produk}
                        className={cn(
                            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110',
                            mode === 'admin' &&
                                isArchived &&
                                'grayscale filter',
                        )}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-3xl font-black text-slate-300 transition-transform duration-500 group-hover:scale-110">
                        {getInitials(product.nama_produk)}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div
                className={cn(
                    'flex flex-1 flex-col p-4',
                    mode === 'admin' && isArchived && 'opacity-75',
                )}
            >
                <h3
                    className={cn(
                        'mb-1 font-bold text-slate-900 transition-colors group-hover:text-[#ef5350]',
                        mode === 'pos'
                            ? 'line-clamp-2 text-sm'
                            : 'line-clamp-1 text-base',
                    )}
                    title={product.nama_produk}
                >
                    {product.nama_produk}
                </h3>
                <p
                    className={cn(
                        'text-[#ef5350]',
                        mode === 'pos'
                            ? 'text-base font-extrabold'
                            : 'mt-1 text-lg font-black text-orange-500',
                    )}
                >
                    {formatRupiah(product.harga_jual)}
                </p>

                {/* Admin Footer */}
                {mode === 'admin' && (
                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        {/* Archive Toggle */}
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={isArchived}
                                onChange={toggleStatus}
                                className={cn(
                                    isArchived ? 'bg-red-500' : 'bg-slate-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none',
                                )}
                            >
                                <span className="sr-only">Arsipkan</span>
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        isArchived
                                            ? 'translate-x-5'
                                            : 'translate-x-0',
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                    )}
                                />
                            </Switch>
                            <span
                                className={cn(
                                    'text-xs font-bold uppercase',
                                    isArchived
                                        ? 'text-red-500'
                                        : 'text-slate-400',
                                )}
                            >
                                {isArchived ? 'Diarsipkan' : 'Arsipkan'}
                            </span>
                        </div>

                        {/* Actions */}
                        <TableAction
                            onEdit={() => setShowEditConfirm(true)}
                            onDelete={() => onDelete?.(product)}
                        />

                        <ModalKonfirmasi
                            isOpen={showEditConfirm}
                            onClose={() => setShowEditConfirm(false)}
                            onConfirm={() => {
                                router.get(route('produk.edit', product.id_produk));
                            }}
                            title="Edit Produk"
                            description={`Apakah Anda yakin ingin mengedit produk "${product.nama_produk}"?`}
                            confirmText="Edit"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
