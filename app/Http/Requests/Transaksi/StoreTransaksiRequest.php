<?php

namespace App\Http\Requests\Transaksi;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransaksiRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'kategori' => 'required|string',
            'metode_bayar' => 'required|in:cash,qris',
            'jumlah_bayar' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.id_produk' => 'required|exists:produks,id_produk',
            'items.*.qty' => 'required|integer|min:1'
        ];
    }

    public function messages()
    {
        return [
            'kategori.required' => 'Kategori wajib diisi.',
            'kategori.string' => 'Kategori harus berupa teks.',
            'metode_bayar.required' => 'Metode bayar wajib diisi.',
            'metode_bayar.in' => 'Metode bayar harus cash atau qris.',
            'jumlah_bayar.required' => 'Jumlah bayar wajib diisi.',
            'jumlah_bayar.numeric' => 'Jumlah bayar harus berupa angka.',
            'items.required' => 'Daftar produk wajib diisi.',
            'items.array' => 'Daftar produk harus berupa array.',
            'items.min' => 'Minimal 1 produk harus dipilih.',
            'items.*.id_produk.required' => 'Produk wajib dipilih.',
            'items.*.id_produk.exists' => 'Produk tidak ditemukan.',
            'items.*.qty.required' => 'Jumlah produk wajib diisi.',
            'items.*.qty.integer' => 'Jumlah produk harus berupa angka.',
            'items.*.qty.min' => 'Minimal 1 produk.',
        ];
    }
}
