<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProdukRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $produk = $this->route('produk');
        
        return [
            'nama_produk' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('produks', 'nama_produk')->where(function ($query) {
                    return $query->where('kategori', request('kategori'));
                })->ignore($produk->id_produk ?? $produk, 'id_produk'),
            ],
            'harga_jual' => 'sometimes|numeric|min:0',
            'gambar' => 'nullable|string', // Optional, string path
            'kategori' => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages()
    {
        return [
            'nama_produk.string' => 'Nama produk harus berupa teks.',
            'nama_produk.max' => 'Nama produk maksimal 255 karakter.',
            'nama_produk.unique' => 'Produk sudah ada',
            'harga_jual.numeric' => 'Harga jual harus berupa angka.',
            'harga_jual.min' => 'Harga jual minimal 0.',
            'gambar.image' => 'Gambar harus berupa gambar.',
            'gambar.max' => 'Ukuran gambar maksimal 5MB.',
            'kategori.string' => 'Kategori harus berupa teks.',
            'kategori.max' => 'Kategori maksimal 255 karakter.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
        ];
    }
}
