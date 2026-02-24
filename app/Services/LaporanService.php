<?php

namespace App\Services;

use App\Models\Bonus;
use App\Models\Gaji;
use App\Models\Pengeluaran;
use App\Models\Produk;
use App\Models\Transaksi;
use Carbon\Carbon;

class LaporanService
{
    public function getPenjualan(array $filters)
    {
        $startDate = $filters['start_date'] ?? Carbon::now()->startOfMonth()->toDateString();
        $endDate = $filters['end_date'] ?? Carbon::now()->endOfMonth()->toDateString();

        $transactions = Transaksi::with(['kasir', 'faktur', 'details.produk'])
            ->whereDate('tanggal', '>=', $startDate)
            ->whereDate('tanggal', '<=', $endDate)
            ->latest('tanggal')
            ->get();

        $totalOmset = $transactions->sum('subtotal');
        $totalProduk = $transactions->flatMap->details->sum('qty');

        return [
            'transactions' => $transactions,
            'summary' => [
                'total_transaksi' => $transactions->count(),
                'total_omset' => $totalOmset,
                'total_produk' => $totalProduk,
            ]
        ];
    }

    public function getProduk(?string $category)
    {
        $query = Produk::query()->where('is_active', true);

        if ($category && $category !== 'Semua') {
            $query->where('kategori', $category);
        }

        return $query->orderBy('nama_produk')->get();
    }

    public function getCategories()
    {
        return Produk::select('kategori')
            ->where('is_active', true)
            ->distinct()
            ->whereNotNull('kategori')
            ->pluck('kategori');
    }

    public function getLabaRugi(array $filters)
    {
        $startDate = $filters['start_date'] ?? Carbon::now()->startOfMonth()->toDateString();
        $endDate = $filters['end_date'] ?? Carbon::now()->endOfMonth()->toDateString();

        // 1. Pendapatan (Omset)
        $totalOmset = Transaksi::whereDate('tanggal', '>=', $startDate)
            ->whereDate('tanggal', '<=', $endDate)
            ->sum('subtotal');

        // 2. Pengeluaran Bahan / Operasional
        $pengeluaran = Pengeluaran::whereDate('tanggal', '>=', $startDate)
            ->whereDate('tanggal', '<=', $endDate)
            ->get();
        $totalPengeluaran = $pengeluaran->sum('jumlah');

        // 3. Gaji & Bonus
        $totalGaji = Gaji::whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->sum('gaji_pokok');

        $totalBonus = Bonus::where('status', 'disetujui')
            ->whereDate('created_at', '>=', $startDate)
            ->whereDate('created_at', '<=', $endDate)
            ->sum('jumlah');

        $totalBeban = $totalPengeluaran + $totalGaji + $totalBonus;
        $labaBersih = $totalOmset - $totalBeban;

        return [
            'summary' => [
                'total_omset' => $totalOmset,
                'total_pengeluaran' => $totalPengeluaran,
                'total_gaji' => $totalGaji,
                'total_bonus' => $totalBonus,
                'total_beban' => $totalBeban,
                'laba_bersih' => $labaBersih,
            ],
            'details' => [
                'pengeluaran' => $pengeluaran,
                // Kita bisa tambah detail lain jika perlu
            ],
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ];
    }
}
