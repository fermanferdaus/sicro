import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import useAuth from '@/Hooks/useAuth';
import DateFilter from '@/Components/Core/DateFilter';
import SummaryCard from '@/Components/Core/SummaryCard';
import DataTable from '@/Components/Core/DataTable';
import {
    Banknote,
    FileText,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import PrimaryButton from '@/Components/Form/PrimaryButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { formatRupiah, formatDateLong, formatMonthYear } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Pengeluaran {
    id_pengeluaran: string;
    judul: string;
    kategori: string;
    jumlah: number;
    tanggal: string;
    deskripsi?: string;
}

interface LabaRugiProps {
    summary: {
        total_omset: number;
        total_pengeluaran: number;
        total_gaji: number;
        total_bonus: number;
        total_beban: number;
        laba_bersih: number;
    };
    details: {
        pengeluaran: Pengeluaran[];
    };
    filters: {
        start_date: string;
        end_date: string;
    };
}

export default function LabaRugi({ summary, details, filters }: LabaRugiProps) {
    const { profil } = usePage<any>().props;
    const { user } = useAuth();
    const [filterType, setFilterType] = useState<
        'daily' | 'monthly' | 'period'
    >('monthly');
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setStartDate(filters.start_date);
        setEndDate(filters.end_date);
    }, [filters.start_date, filters.end_date]);

    const handleDateChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        router.get(
            route('laporan.laba-rugi'),
            { start_date: start, end_date: end },
            { preserveState: true, replace: true },
        );
    };

    const filteredExpenses = details.pengeluaran.filter(
        (item) =>
            item.judul.toLowerCase().includes(search.toLowerCase()) ||
            item.kategori.toLowerCase().includes(search.toLowerCase()),
    );

    const handlePrintPDF = () => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const logoSrc = profil?.logo_url || '/Logo1.png';
        const logo = new Image();
        logo.src = logoSrc;

        try {
            doc.addImage(logo, 'PNG', 15, 10, 20, 20);
        } catch (e) {}

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text((profil?.nama_store || 'SICRO').toUpperCase(), 40, 18);
        doc.setFontSize(12);
        doc.text('LAPORAN LABA RUGI', 40, 24);
        let periodText = '';
        if (filterType === 'daily') {
            periodText = `Tanggal: ${formatDateLong(startDate)}`;
        } else if (filterType === 'monthly') {
            periodText = `Bulan: ${formatMonthYear(startDate)}`;
        } else if (filterType === 'period') {
            periodText = `Periode: ${formatDateLong(startDate)} s.d. ${formatDateLong(endDate)}`;
        } else {
            periodText = 'Semua Data Laba Rugi';
        }

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(periodText, 40, 29);

        doc.setLineWidth(0.5);
        doc.line(15, 35, pageWidth - 15, 35);

        // Detail Expenses Table
        doc.setFont('helvetica', 'bold');
        doc.text('DETAIL PENGELUARAN', 15, 42);

        autoTable(doc, {
            startY: 45,
            head: [
                [
                    { content: 'No', styles: { halign: 'center' as const } },
                    'Tanggal',
                    'Keterangan',
                    'Kategori',
                    { content: 'Jumlah', styles: { halign: 'right' } },
                ],
            ],
            body: filteredExpenses.map((ex, i) => [
                i + 1,
                formatDateLong(ex.tanggal),
                ex.judul,
                ex.kategori,
                formatRupiah(ex.jumlah),
            ]),
            styles: { fontSize: 10 },
            columnStyles: {
                0: { halign: 'center' }, // No
                4: { halign: 'right' }, // Jumlah
            },
        });

        // Summary Table
        doc.setFont('helvetica', 'bold');
        doc.text(
            'RINGKASAN KEUANGAN',
            15,
            (doc as any).lastAutoTable.finalY + 15,
        );

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [
                [
                    'Keterangan',
                    { content: 'Jumlah', styles: { halign: 'right' } },
                ],
            ],
            body: (() => {
                const bodyRows: any[][] = [
                    [
                        'Total Pendapatan (Omset)',
                        formatRupiah(summary.total_omset),
                    ],
                ];

                if (summary.total_pengeluaran > 0) {
                    bodyRows.push([
                        'Total Pengeluaran',
                        formatRupiah(summary.total_pengeluaran),
                    ]);
                }

                if (summary.total_gaji > 0) {
                    bodyRows.push([
                        'Total Beban Gaji',
                        formatRupiah(summary.total_gaji),
                    ]);
                }

                if (summary.total_bonus > 0) {
                    bodyRows.push([
                        'Total Beban Bonus',
                        formatRupiah(summary.total_bonus),
                    ]);
                }

                if (summary.total_beban > 0) {
                    bodyRows.push([
                        {
                            content: 'Total Beban Operasional',
                            styles: { fontStyle: 'bold' },
                        },
                        {
                            content: formatRupiah(summary.total_beban),
                            styles: { fontStyle: 'bold' },
                        },
                    ]);
                }

                return bodyRows;
            })().concat([
                [
                    {
                        content: 'LABA BERSIH',
                        styles: {
                            fontStyle: 'bold',
                            fillColor: [240, 240, 240],
                        },
                    },
                    {
                        content: formatRupiah(summary.laba_bersih),
                        styles: {
                            fontStyle: 'bold',
                            fillColor: [240, 240, 240],
                        },
                    },
                ],
            ]),
            theme: 'striped',
            styles: { fontSize: 10 },
            columnStyles: { 1: { halign: 'right' } },
        });

        // === FOOTER / SIGNATURE ===
        let finalY = (doc as any).lastAutoTable.finalY + 20;
        const pageHeight = doc.internal.pageSize.getHeight();

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

        doc.text(`Owner,`, startX, finalY + 6);

        doc.text(
            profil?.nama_owner || '(..........................)',
            startX,
            finalY + 25,
        );

        doc.save(`Laporan_Laba_Rugi_${startDate}.pdf`);
    };

    const columns = [
        {
            key: 'no',
            label: 'No',
            render: (_: Pengeluaran, index: number) => index + 1,
        },
        {
            key: 'tanggal',
            label: 'Tanggal',
            render: (item: Pengeluaran) => formatDateLong(item.tanggal),
        },
        {
            key: 'judul',
            label: 'Keterangan',
            render: (item: Pengeluaran) => (
                <div>
                    <div className="font-bold text-slate-900">{item.judul}</div>
                    <div className="text-xs text-slate-500">
                        {item.deskripsi || '-'}
                    </div>
                </div>
            ),
        },
        {
            key: 'kategori',
            label: 'Kategori',
            render: (item: Pengeluaran) => (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                    {item.kategori}
                </span>
            ),
        },
        {
            key: 'jumlah',
            label: 'Jumlah',
            render: (item: Pengeluaran) => (
                <span className="font-bold text-red-600">
                    -{formatRupiah(item.jumlah)}
                </span>
            ),
            className: 'text-right',
        },
    ];

    return (
        <MainLayout onSearch={setSearch} searchValue={search}>
            <Head title="Laporan Laba Rugi" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href={route('laporan.index')}
                            className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800"
                        >
                            <ArrowLeft className="h-5 w-5" /> Kembali
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Laporan Laba Rugi
                        </h1>
                        <p className="text-slate-500">
                            Analisis pendapatan dan pengeluaran
                        </p>
                    </div>
                    <PrimaryButton
                        onClick={handlePrintPDF}
                        className="w-fit gap-2"
                    >
                        <FileText className="h-4 w-4" /> Cetak PDF
                    </PrimaryButton>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <SummaryCard
                        title="Total Omset"
                        value={formatRupiah(summary.total_omset)}
                        icon={Banknote}
                        gradient="from-purple-500 to-purple-600"
                    />
                    <SummaryCard
                        title="Total Beban"
                        value={formatRupiah(summary.total_beban)}
                        icon={TrendingDown}
                        gradient="from-red-500 to-red-600"
                    />
                    <SummaryCard
                        title="Laba Bersih"
                        value={formatRupiah(summary.laba_bersih)}
                        icon={
                            summary.laba_bersih >= 0 ? TrendingUp : TrendingDown
                        }
                        gradient={
                            summary.laba_bersih >= 0
                                ? 'from-emerald-500 to-emerald-600'
                                : 'from-orange-500 to-orange-600'
                        }
                    />
                </div>

                <div>
                    <DateFilter
                        filterType={filterType}
                        startDate={startDate}
                        endDate={endDate}
                        onFilterTypeChange={setFilterType}
                        onDateChange={handleDateChange}
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-left text-lg font-bold text-slate-900">
                        Ringkasan Keuangan
                    </h3>
                    <div className="space-y-3">
                        {summary.total_omset === 0 &&
                        summary.total_beban === 0 ? (
                            <div className="py-10 text-center">
                                <p className="text-slate-500 italic">
                                    Tidak ada data keuangan untuk ditampilkan
                                    pada periode ini.
                                </p>
                            </div>
                        ) : (
                            <>
                                {summary.total_omset > 0 && (
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Pendapatan Penjualan</span>
                                        <span className="font-bold text-green-600">
                                            {formatRupiah(summary.total_omset)}
                                        </span>
                                    </div>
                                )}
                                {summary.total_beban > 0 && (
                                    <div className="flex justify-between border-b pb-2 text-slate-600 italic">
                                        <span>Total Beban Operasional</span>
                                        <span>
                                            {formatRupiah(summary.total_beban)}
                                        </span>
                                    </div>
                                )}
                                {summary.total_pengeluaran > 0 && (
                                    <div className="flex justify-between pl-4 text-sm text-slate-500">
                                        <span>- Pengeluaran</span>
                                        <span>
                                            {formatRupiah(
                                                summary.total_pengeluaran,
                                            )}
                                        </span>
                                    </div>
                                )}
                                {summary.total_gaji > 0 && (
                                    <div className="flex justify-between pl-4 text-sm text-slate-500">
                                        <span>- Beban Gaji</span>
                                        <span>
                                            {formatRupiah(summary.total_gaji)}
                                        </span>
                                    </div>
                                )}
                                {summary.total_bonus > 0 && (
                                    <div className="flex justify-between pl-4 text-sm text-slate-500">
                                        <span>- Beban Bonus</span>
                                        <span>
                                            {formatRupiah(summary.total_bonus)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t-2 border-slate-300 pt-4 text-lg font-black text-slate-900">
                                    <span>LABA BERSIH</span>
                                    <span
                                        className={
                                            summary.laba_bersih >= 0
                                                ? 'text-blue-600'
                                                : 'text-red-600'
                                        }
                                    >
                                        {formatRupiah(summary.laba_bersih)}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">
                        Detail Pengeluaran Terdaftar
                    </h3>
                    <DataTable
                        columns={columns}
                        data={filteredExpenses}
                        meta={
                            {
                                current_page: 1,
                                from: 1,
                                last_page: 1,
                                links: [],
                                path: '',
                                per_page: 10,
                                to: filteredExpenses.length,
                                total: filteredExpenses.length,
                            } as any
                        }
                        filters={{ search, per_page: 10 }}
                        onSearch={setSearch}
                        onPageChange={() => {}}
                        onPerPageChange={() => {}}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
