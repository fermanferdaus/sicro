<?php

namespace App\Services;

use App\Models\Bonus;
use App\Models\Gaji;
use App\Models\Pengeluaran;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardService
{
    public function getDashboardStats(User $user)
    {
        // Data umum yang bisa diakses semua role (atau sesuaikan jika kasir punya view beda)
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        $chartData = Transaksi::whereBetween('tanggal', [$startDate->toDateString(), $endDate->toDateString()])
            ->selectRaw('DATE(tanggal) as date, SUM(subtotal) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('d M'),
                    'total' => (int) $item->total,
                ];
            });

        $data = [
            'total_transaksi' => Transaksi::whereBetween('tanggal', [$startDate->toDateString(), $endDate->toDateString()])->count(),
            'total_produk' => Produk::where('is_active', true)->count(),
            'total_omset' => (int) Transaksi::whereBetween('tanggal', [$startDate->toDateString(), $endDate->toDateString()])->sum('subtotal'),
            'sales_chart' => $chartData,
            'recent_transactions' => Transaksi::with(['faktur', 'kasir'])
                ->whereDate('tanggal', now()->toDateString())
                ->orderByDesc('created_at')
                ->limit($user->role === 'owner' ? 7 : 5)
                ->get(),
        ];

        // Data khusus Owner
        if ($user->role === 'owner') {
            $totalPengeluaran = $this->calculateTotalPengeluaran();
            $data['total_pengeluaran'] = $totalPengeluaran;
            $data['laba_bersih'] = $data['total_omset'] - $totalPengeluaran;
            $data['expense_chart'] = $this->getExpenseChartData($startDate, $endDate);
        }

        return $data;
    }

    private function calculateTotalPengeluaran()
    {
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();

        // 1. Pengeluaran Operasional
        $totalPengeluaran = Pengeluaran::whereBetween('tanggal', [$startDate, $endDate])->sum('jumlah');

        // 2. Gaji (Actual records in this month)
        $totalGaji = Gaji::whereBetween('created_at', [$startDate, $endDate])->sum('gaji_pokok');

        // 3. Bonus (Actual records in this month, only approved)
        $totalBonus = Bonus::where('status', 'disetujui')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('jumlah');

        return (int) ($totalPengeluaran + $totalGaji + $totalBonus);
    }

    private function getExpenseChartData($startDate, $endDate)
    {
        // Pengeluaran Operasional Harian
        $pengeluaran = Pengeluaran::whereBetween('tanggal', [$startDate, $endDate])
            ->selectRaw('DATE(tanggal) as date, SUM(jumlah) as total')
            ->groupBy('date')
            ->get();

        // Bonus Harian (Asumsi bonus punya tanggal atau created_at, sesuaikan model Bonus)
        // Jika Bonus tidak punya tanggal khusus, gunakan created_at atau updated_at
        $bonus = Bonus::where('status', 'dibayar')
            ->whereBetween('updated_at', [$startDate, $endDate])
            ->selectRaw('DATE(updated_at) as date, SUM(jumlah) as total')
            ->groupBy('date')
            ->get();

        // Gabungkan semua data
        $mergedData = collect();

        $processData = function ($items) use ($mergedData) {
            foreach ($items as $item) {
                $date = $item->date;
                $total = (int) $item->total;

                if ($mergedData->has($date)) {
                    $mergedData[$date] += $total;
                } else {
                    $mergedData[$date] = $total;
                }
            }
        };

        $processData($pengeluaran);
        $processData($bonus);

        // Format data untuk chart
        return $mergedData->sortKeys()->map(function ($total, $date) {
            return [
                'date' => Carbon::parse($date)->format('d M'),
                'total' => $total,
            ];
        })->values()->all();
    }
}
