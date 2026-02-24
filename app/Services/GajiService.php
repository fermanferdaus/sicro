<?php

namespace App\Services;

use App\Models\Gaji;

class GajiService
{
    public function getAll($search = null)
    {
        return Gaji::with('pegawai')
            ->when($search, function ($query, $search) {
                $query->whereHas('pegawai', function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('kode_pegawai', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get();
    }

    public function getPegawai($excludeWithGaji = false)
    {
        $query = \App\Models\Pegawai::with('user');

        if ($excludeWithGaji) {
            $query->whereDoesntHave('gajis');
        }

        return $query->get();
    }

    public function create(array $data)
    {
        return Gaji::create($data);
    }

    public function update(Gaji $gaji, array $data)
    {
        $gaji->update($data);
        return $gaji;
    }

    public function delete(Gaji $gaji)
    {
        $gaji->delete();
    }
}
