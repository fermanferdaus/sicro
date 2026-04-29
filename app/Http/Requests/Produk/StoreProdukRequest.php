<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProdukRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nama_produk' => [
                'required',
                'string',
                'max:255',
                Rule::unique('produks', 'nama_produk')->where(function ($query) {
                    return $query->where('kategori', request('kategori'));
                }),
            ],
            'harga_jual' => 'required|numeric|min:0',
            'gambar' => 'nullable|string', // Temporary image path or existing path
            'kategori' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'nama_produk.required' => 'Nama produk wajib diisi.',
            'nama_produk.string' => 'Nama produk harus berupa teks.',
            'nama_produk.max' => 'Nama produk maksimal 255 karakter.',
            'nama_produk.unique' => 'Produk sudah ada',
            'harga_jual.required' => 'Harga jual wajib diisi.',
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
