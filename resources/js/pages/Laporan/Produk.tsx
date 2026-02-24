import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useAuth from '@/Hooks/useAuth';
import CategoryFilter from '@/Components/Core/CategoryFilter';
import SummaryCard from '@/Components/Core/SummaryCard';
import DataTable from '@/Components/Core/DataTable';
import { Package } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, ArrowLeft } from 'lucide-react';
import { formatRupiah, formatMonthYear } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Product {
    id_produk: string;
    nama_produk: string;
    kategori: string;
    harga_jual: number;
    harga_awal?: number;
    nama_store?: string;
}

interface LaporanProdukProps {
    products: Product[];
    categories: string[];
    filters: {
        category: string | null;
    };
}

export default function Produk({
    products,
    categories,
    filters,
}: LaporanProdukProps) {
    const { profil } = usePage<any>().props;
    const { user, isOwner } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState(filters.category);

    // Client-side Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category);
        router.get(
            route('laporan.produk'),
            { category },
            { preserveState: true, replace: true },
        );
    };

    const currentDate = new Date();
    const currentMonth = formatMonthYear(currentDate.toISOString());

    // Filter Logic (Search)
    const filteredProducts = products.filter((item) => {
        const matchesSearch = search
            ? item.nama_produk.toLowerCase().includes(search.toLowerCase()) ||
              (item.kategori || '').toLowerCase().includes(search.toLowerCase())
            : true;
        return matchesSearch;
    });

    // Pagination Logic
    const lastPage = Math.ceil(filteredProducts.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredProducts.length);
    const paginatedData = filteredProducts.slice(from, to);

    // Generate Pagination Links
    const generateLinks = () => {
        const links = [];
        // Previous
        links.push({
            url: currentPage > 1 ? `#page=${currentPage - 1}` : null,
            label: '&laquo; Previous',
            active: false,
        });

        const delta = 2;
        for (let i = 1; i <= lastPage; i++) {
            if (
                i === 1 ||
                i === lastPage ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                links.push({
                    url: `#page=${i}`,
                    label: i.toString(),
                    active: i === currentPage,
                });
            } else if (
                links[links.length - 1].label !== '...' &&
                links.length > 1
            ) {
                links.push({
                    url: null,
                    label: '...',
                    active: false,
                });
            }
        }

        // Next
        links.push({
            url: currentPage < lastPage ? `#page=${currentPage + 1}` : null,
            label: 'Next &raquo;',
            active: false,
        });
        return links;
    };

    const paginationMeta = {
        current_page: currentPage,
        from: from + 1,
        last_page: lastPage,
        links: generateLinks(),
        path: '',
        per_page: perPage,
        to: to,
        total: filteredProducts.length,
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        if (url.startsWith('#page=')) {
            const page = parseInt(url.split('=')[1]);
            if (!isNaN(page)) {
                setCurrentPage(page);
            }
        }
    };

    const handlePerPageChange = (val: number) => {
        setPerPage(val);
        setCurrentPage(1);
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        setCurrentPage(1);
    };

    // PDF EXPORT
    const handlePrintPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // === LOGO ===
        const logoSrc = profil?.logo_url || '/Logo1.png';
        const logo = new Image();
        logo.src = logoSrc;
        try {
            doc.addImage(logo, 'PNG', 15, 10, 20, 20);
        } catch (e) {}

        // === HEADER ===
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text((profil?.nama_store || 'SICRO').toUpperCase(), 40, 18);
        doc.setFontSize(12);
        doc.text('LAPORAN DATA PRODUK', 40, 24);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Bulan: ${currentMonth}`, 40, 29);

        // Adjust line separator position because we added one more line of text
        doc.setLineWidth(0.5);
        doc.line(15, 35, pageWidth - 15, 35);

        // === TABLE ===
        const headers = [
            [
                { content: 'No', styles: { halign: 'center' as const } },
                'Nama Produk',
                'Kategori',
                { content: 'Harga Jual', styles: { halign: 'right' as const } },
            ],
        ];

        const rows: (
            | string
            | number
            | { content: string | number; colSpan?: number; styles?: any }
        )[][] = filteredProducts.map((d, i) => [
            i + 1,
            d.nama_produk,
            d.kategori || '-',
            formatRupiah(d.harga_jual),
        ]);

        // Add Summary Row (Total Produk)
        rows.push([
            {
                content: 'Total Produk',
                colSpan: 3,
                styles: { halign: 'right' as const, fontStyle: 'bold' },
            },
            {
                content: `${filteredProducts.length} Pcs`,
                styles: { halign: 'right' as const, fontStyle: 'bold' },
            },
        ]);

        autoTable(doc, {
            startY: 40,
            head: headers,
            body: rows,
            theme: 'striped',
            styles: { fontSize: 10 },
            columnStyles: {
                0: { halign: 'center' },
                3: { halign: 'right' }, // Harga
            },
        });

        // === FOOTER / SIGNATURE ===
        let finalY = (doc as any).lastAutoTable.finalY + 20;

        // Check for page overflow
        if (finalY + 40 > pageHeight) {
            doc.addPage();
            finalY = 20;
        }

        const dateStr = `Bandar Lampung, ${new Date().toLocaleDateString(
            'id-ID',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            },
        )}`;

        const startX = pageWidth - 80;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`${dateStr}`, startX, finalY);

        const signatureLabel = isOwner ? 'Owner,' : 'Kasir,';
        const signatureName = isOwner
            ? profil?.nama_owner || '(..........................)'
            : user?.nama_lengkap || '(..........................)';

        doc.text(signatureLabel, startX, finalY + 6);

        doc.text(signatureName, startX, finalY + 25);

        doc.save(
            `Laporan_Produk_${currentDate.toISOString().slice(0, 10)}.pdf`,
        );
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Product, index: number) => (
                <span className="font-bold text-slate-500">
                    {from + index + 1}
                </span>
            ),
        },
        {
            key: 'nama_produk',
            label: 'Nama Produk',
            render: (item: Product) => (
                <span className="font-bold text-slate-900">
                    {item.nama_produk}
                </span>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: Product) => (
                <span className="text-slate-600">{item.kategori || '-'}</span>
            ),
        },
        {
            key: 'harga_jual',
            label: 'Harga',
            render: (item: Product) => (
                <span className="font-bold text-slate-900">
                    {formatRupiah(item.harga_jual)}
                </span>
            ),
            className: 'text-right',
        },
    ];

    return (
        <MainLayout onSearch={handleSearch} searchValue={search}>
            <Head title="Laporan Produk" />

            <div>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href={route('laporan.index')}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Kembali
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Laporan Produk
                        </h1>
                        <p className="text-slate-500">
                            Daftar produk dan status stok
                        </p>
                    </div>

                    <PrimaryButton
                        onClick={handlePrintPDF}
                        className="w-fit gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        Cetak PDF
                    </PrimaryButton>
                </div>

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Total Produk"
                        value={filteredProducts.length}
                        icon={Package}
                        gradient="from-green-500 to-green-600"
                    />
                </div>

                <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex-1">
                        <CategoryFilter
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={paginatedData}
                    meta={paginationMeta as any}
                    filters={{ search, per_page: perPage }}
                    onPageChange={handlePageChange}
                    onSearch={handleSearch}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </MainLayout>
    );
}
