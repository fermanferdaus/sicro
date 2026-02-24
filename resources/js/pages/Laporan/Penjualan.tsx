import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useAuth from '@/Hooks/useAuth';
import DateFilter from '@/Components/Core/DateFilter';
import SummaryCard from '@/Components/Core/SummaryCard';
import DataTable from '@/Components/Core/DataTable';
import { ShoppingCart, Banknote } from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FileText, ArrowLeft, Package } from 'lucide-react';
import { formatRupiah, formatDateLong, formatMonthYear } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
    id_transaksi: string;
    faktur: {
        nomor_faktur: string;
    };
    tanggal: string;
    created_at: string;
    subtotal: number;
    metode_bayar: string;
    kasir: { nama_lengkap: string };
    details: {
        id_detail: string;
        produk: { nama_produk: string };
        qty: number;
    }[];
}

interface LaporanPenjualanProps {
    transactions: Transaction[];
    filters: {
        start_date: string;
        end_date: string;
    };
    summary: {
        total_transaksi: number;
        total_omset: number;
        total_produk: number;
    };
}

export default function Penjualan({
    transactions,
    filters,
    summary,
}: LaporanPenjualanProps) {
    const { profil } = usePage<any>().props;
    const { user, isOwner } = useAuth();
    const [filterType, setFilterType] = useState<
        'daily' | 'monthly' | 'period'
    >('monthly');
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    useEffect(() => {
        setStartDate(filters.start_date);
        setEndDate(filters.end_date);
    }, [filters.start_date, filters.end_date]);

    // Client-side Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');

    // Apply filters when dates change
    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1); // Reset page on filter change
        router.get(
            route('laporan.penjualan'),
            { start_date: start, end_date: end },
            { preserveState: true, replace: true },
        );
    };

    // Filter Logic (Search)
    const filteredTransactions = transactions.filter((item) => {
        const matchesSearch = search
            ? item.faktur?.nomor_faktur
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
              item.kasir?.nama_lengkap
                  .toLowerCase()
                  .includes(search.toLowerCase())
            : true;
        return matchesSearch;
    });

    // Pagination Logic
    const lastPage = Math.ceil(filteredTransactions.length / perPage);
    const from = (currentPage - 1) * perPage;
    const to = Math.min(from + perPage, filteredTransactions.length);
    const paginatedData = filteredTransactions.slice(from, to);

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
        total: filteredTransactions.length,
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
            orientation: 'landscape',
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
        doc.text('LAPORAN PENJUALAN', 40, 24);

        let periodText = '';
        if (filterType === 'daily') {
            periodText = `Tanggal: ${formatDateLong(startDate)}`;
        } else if (filterType === 'monthly') {
            periodText = `Bulan: ${formatMonthYear(startDate)}`;
        } else if (filterType === 'period') {
            periodText = `Periode: ${formatDateLong(startDate)} s.d. ${formatDateLong(endDate)}`;
        } else {
            periodText = 'Semua Data Penjualan Produk';
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(periodText, 40, 29);

        // Line Separator
        doc.setLineWidth(0.5);
        doc.line(15, 35, pageWidth - 15, 35);

        // === TABLE ===
        const headers = [
            [
                { content: 'No', styles: { halign: 'center' as const } },
                'No. Invoice',
                'Tanggal',
                { content: 'Waktu', styles: { halign: 'center' as const } },
                'Kasir',
                'Produk',
                { content: 'Jumlah', styles: { halign: 'center' as const } },
                {
                    content: 'Metode Bayar',
                    styles: { halign: 'center' as const },
                },
                { content: 'Subtotal', styles: { halign: 'right' as const } },
            ],
        ];

        const rows: (
            | string
            | number
            | { content: string | number; colSpan?: number; styles?: any }
        )[][] = transactions.map((t, i) => [
            i + 1,
            t.faktur?.nomor_faktur || '-',
            formatDateLong(t.tanggal),
            new Date(t.created_at || t.tanggal).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            t.kasir?.nama_lengkap || '-',
            t.details.map((d) => d.produk?.nama_produk).join('\n'),
            t.details.map((d) => d.qty).join('\n'),
            t.metode_bayar,
            formatRupiah(t.subtotal),
        ]);

        // Add Total Row
        rows.push([
            {
                content: 'Total Omset',
                colSpan: 8,
                styles: { halign: 'right' as const, fontStyle: 'bold' },
            },
            {
                content: formatRupiah(summary.total_omset),
                styles: { halign: 'right' as const, fontStyle: 'bold' },
            },
        ]);

        autoTable(doc, {
            startY: 40,
            head: headers,
            body: rows,
            theme: 'striped',
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: {
                0: { halign: 'center' }, // No
                3: { halign: 'center' }, // Waktu
                6: { halign: 'center' }, // Jumlah
                7: { halign: 'center' }, // Metode Bayar
                8: { halign: 'right' }, // Total
            },
            didParseCell: (data) => {
                if (data.column.index === 7 && data.section === 'body') {
                    if (typeof data.cell.raw === 'string') {
                        data.cell.text = [
                            data.cell.raw.charAt(0).toUpperCase() +
                                data.cell.raw.slice(1),
                        ];
                    }
                }
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

        // Right aligned signature block
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

        doc.save(`Laporan_Penjualan_${startDate}_${endDate}.pdf`);
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_item: Transaction, index: number) => (
                <span className="font-bold text-slate-500">
                    {from + index + 1}
                </span>
            ),
        },
        {
            key: 'faktur.nomor_faktur',
            label: 'Invoice',
            render: (item: Transaction) => (
                <span className="font-black text-slate-900">
                    {item.faktur?.nomor_faktur}
                </span>
            ),
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (item: Transaction) => (
                <span className="text-slate-600">
                    {formatDateLong(item.tanggal)}
                </span>
            ),
        },
        {
            key: 'waktu',
            label: 'Waktu',
            render: (item: Transaction) => (
                <span className="text-slate-600">
                    {new Date(
                        item.created_at || item.tanggal,
                    ).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            ),
        },
        {
            key: 'kasir.nama_lengkap',
            label: 'Kasir',
            render: (item: Transaction) => (
                <span className="text-slate-600">
                    {item.kasir?.nama_lengkap || '-'}
                </span>
            ),
        },
        {
            key: 'produk',
            label: 'Produk',
            render: (item: Transaction) => (
                <div className="flex flex-col gap-1">
                    {item.details?.map((detail, idx) => (
                        <span
                            key={idx}
                            className="text-xs font-medium text-slate-700"
                        >
                            {detail.produk?.nama_produk}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            render: (item: Transaction) => (
                <div className="flex flex-col gap-1">
                    {item.details?.map((detail, idx) => (
                        <span key={idx} className="text-xs text-slate-500">
                            {detail.qty}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            key: 'metode_bayar',
            label: 'Metode Bayar',
            render: (item: Transaction) => (
                <span className="text-slate-600 capitalize">
                    {item.metode_bayar}
                </span>
            ),
        },
        {
            key: 'subtotal',
            label: 'Total',
            render: (item: Transaction) => (
                <span className="font-bold text-slate-900">
                    {formatRupiah(item.subtotal)}
                </span>
            ),
            className: 'text-right',
        },
    ];

    return (
        <MainLayout onSearch={handleSearch} searchValue={search}>
            <Head title="Laporan Penjualan" />
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
                            Laporan Penjualan
                        </h1>
                        <p className="text-slate-500">
                            Rekapitulasi transaksi penjualan
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

                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SummaryCard
                        title="Total Transaksi"
                        value={summary.total_transaksi}
                        icon={ShoppingCart}
                        gradient="from-blue-500 to-blue-600"
                    />
                    <SummaryCard
                        title="Total Omset"
                        value={formatRupiah(summary.total_omset)}
                        icon={Banknote}
                        gradient="from-purple-500 to-purple-600"
                    />
                    <SummaryCard
                        title="Total Produk"
                        value={summary.total_produk}
                        icon={Package}
                        gradient="from-green-500 to-green-600"
                    />
                </div>

                <div className="mb-6">
                    <DateFilter
                        filterType={filterType}
                        startDate={startDate}
                        endDate={endDate}
                        onFilterTypeChange={setFilterType}
                        onDateChange={handleDateChange}
                    />
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
