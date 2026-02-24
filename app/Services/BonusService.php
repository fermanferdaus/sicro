<?php

namespace App\Services;

use App\Models\Bonus;

class BonusService
{
    public function getAll($search = null, $month = null, $year = null)
    {
        return Bonus::with('pegawai')
            ->when($search, function ($query, $search) {
                $query->whereHas('pegawai', function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('kode_pegawai', 'like', "%{$search}%");
                })->orWhere('judul', 'like', "%{$search}%");
            })
            ->when($month && $year, function ($query) use ($month, $year) {
                $query->where('periode', "{$year}-" . str_pad($month, 2, '0', STR_PAD_LEFT));
            })
            ->latest()
            ->get();
    }

    public function create(array $data)
    {
        $data['status'] = 'pending';
        return Bonus::create($data);
    }

    public function update(Bonus $bonus, array $data)
    {
        // Remove status from mass update if it's there
        unset($data['status']);

        $bonus->update($data);
        return $bonus;
    }

    public function updateStatus(Bonus $bonus, string $status)
    {
        $bonus->update(['status' => $status]);
        return $bonus;
    }

    public function delete(Bonus $bonus)
    {
        $bonus->delete();
    }

    public function getPegawai()
    {
        return \App\Models\Pegawai::with('user')->get();
    }
}
