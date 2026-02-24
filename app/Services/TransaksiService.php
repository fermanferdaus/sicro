<?php

namespace App\Services;

use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\Produk;
use App\Models\Faktur;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransaksiService
{
    public function getAll()
    {
        return Transaksi::with(['kasir', 'details.produk', 'faktur'])->latest()->get();
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $subtotal = 0;
            $detailItems = [];

            foreach ($data['items'] as $item) {
                $produk = Produk::findOrFail($item['id_produk']);
                $total = $produk->harga_jual * $item['qty'];
                $subtotal += $total;

                $detailItems[] = [
                    'id_detail' => Str::uuid()->toString(),
                    'id_produk' => $produk->id_produk,
                    'harga_satuan' => $produk->harga_jual,
                    'qty' => $item['qty'],
                    'total' => $total,
                    'nama_produk' => $produk->nama_produk // For receipt result
                ];
            }

            if ($data['jumlah_bayar'] < $subtotal) {
                throw new \Exception('Jumlah bayar kurang');
            }

            $transaksi = Transaksi::create([
                'id_transaksi' => Str::uuid()->toString(),
                'id_user' => $data['id_user'],
                'nama_kasir' => auth()->user()->nama_lengkap,
                'kategori' => $data['kategori'],
                'metode_bayar' => $data['metode_bayar'],
                'subtotal' => $subtotal,
                'jumlah_bayar' => $data['jumlah_bayar'],
                'kembalian' => $data['jumlah_bayar'] - $subtotal,
                'tanggal' => now(),
            ]);

            foreach ($detailItems as $detail) {
                $namaProduk = $detail['nama_produk'];
                unset($detail['nama_produk']);

                TransaksiDetail::create([
                    ...$detail,
                    'id_transaksi' => $transaksi->id_transaksi,
                ]);
            }

            $nomorFaktur = $this->generateNomorFaktur();

            Faktur::create([
                'id_faktur' => Str::uuid()->toString(),
                'id_transaksi' => $transaksi->id_transaksi,
                'nomor_faktur' => $nomorFaktur,
                'tanggal_cetak' => now()
            ]);

            return [
                'id_transaksi' => $transaksi->id_transaksi,
                'nomor_faktur' => $nomorFaktur,
                'subtotal' => $subtotal,
                'jumlah_bayar' => $transaksi->jumlah_bayar,
                'kembalian' => $transaksi->kembalian,
                'metode_bayar' => $transaksi->metode_bayar,
                'tanggal' => $transaksi->tanggal->format('d M Y'),
                'waktu' => $transaksi->tanggal->format('H:i')
            ];
        });
    }

    private function generateNomorFaktur()
    {
        $today = Carbon::now();
        $datePart = $today->format('ymd');

        $countToday = Faktur::whereDate('created_at', $today->toDateString())->count() + 1;

        $sequence = str_pad($countToday, 4, '0', STR_PAD_LEFT);

        return "INV/{$datePart}/{$sequence}";
    }

    public function getHistory(array $filters)
    {
        $query = Transaksi::with(['kasir', 'faktur'])->latest();

        if (!empty($filters['search'])) {
            $query->whereHas('faktur', function ($q) use ($filters) {
                $q->where('nomor_faktur', 'like', '%' . $filters['search'] . '%');
            });
        }

        $filterType = $filters['filter_type'] ?? 'monthly';
        $startDate = $filters['start_date'] ?? now()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();

        if ($filterType === 'daily') {
            $query->whereDate('tanggal', $startDate);
        } elseif ($filterType === 'monthly') {
            $date = \Carbon\Carbon::parse($startDate);
            $query->whereMonth('tanggal', $date->month)
                ->whereYear('tanggal', $date->year);
        } elseif ($filterType === 'period') {
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        $perPage = $filters['per_page'] ?? 10;

        // Clone query for aggregates to avoid pagination limit affecting totals
        $totalsQuery = clone $query;

        if ($perPage == -1) {
            $data = $query->get();
        } else {
            $data = $query->paginate($perPage)->withQueryString();
        }

        return [
            'data' => $data,
            'total_transactions' => $totalsQuery->count(),
            'total_revenue' => $totalsQuery->sum('subtotal')
        ];
    }

    public function getDetail($id)
    {
        return Transaksi::with(['kasir', 'details.produk', 'faktur'])->findOrFail($id);
    }
}
