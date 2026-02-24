<?php

namespace App\Services;

use App\Models\Pengeluaran;

class PengeluaranService
{
    public function getAll(array $filters = [])
    {
        return Pengeluaran::with('creator.pegawai')
            ->when(!empty($filters['kategori']), function ($query) use ($filters) {
                $query->where('kategori', $filters['kategori']);
            })
            ->when(isset($filters['filter_type']) && $filters['filter_type'] === 'daily' && isset($filters['start_date']), function ($query) use ($filters) {
                $query->whereDate('tanggal', $filters['start_date']);
            })
            ->when(isset($filters['filter_type']) && $filters['filter_type'] === 'monthly' && isset($filters['start_date']), function ($query) use ($filters) {
                $date = \Carbon\Carbon::parse($filters['start_date']);
                $query->whereMonth('tanggal', $date->month)
                    ->whereYear('tanggal', $date->year);
            })
            ->when(isset($filters['filter_type']) && $filters['filter_type'] === 'period' && isset($filters['start_date']) && isset($filters['end_date']), function ($query) use ($filters) {
                $query->whereBetween('tanggal', [$filters['start_date'], $filters['end_date']]);
            })
            ->latest()
            ->get();
    }

    public function create(array $data)
    {
        $data['created_by'] = auth()->id();
        return Pengeluaran::create($data);
    }

    public function update(Pengeluaran $pengeluaran, array $data)
    {
        if (array_key_exists('bukti_path', $data)) {
            $pengeluaran->bukti_path = $data['bukti_path'];
            unset($data['bukti_path']);
        }

        $pengeluaran->update($data);
        return $pengeluaran;
    }

    public function delete(Pengeluaran $pengeluaran)
    {
        $pengeluaran->delete();
    }
}
