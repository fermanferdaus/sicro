<?php

namespace App\Services;

use App\Models\Produk;

use Illuminate\Support\Facades\Storage;

class ProdukService
{
    public function getAll($search = null)
    {
        $query = Produk::query();

        if ($search) {
            $query->where('nama_produk', 'like', '%' . $search . '%');
        }

        return $query->latest()->get();
    }

    public function create(array $data)
    {
        return Produk::create($data);
    }

    public function update(Produk $produk, array $data)
    {
        if (array_key_exists('gambar', $data)) {
            $produk->gambar = $data['gambar'];
            unset($data['gambar']);
        }

        $produk->update($data);
        return $produk;
    }

    public function delete(Produk $produk)
    {
        $produk->delete();
    }
}
