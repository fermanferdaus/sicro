<?php

namespace App\Http\Requests\Pengeluaran;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePengeluaranRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'jumlah' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'bukti_path' => 'required|string',
            'id_profil' => 'nullable|exists:profils,id_profil',
        ];
    }

    public function messages()
    {
        return [
            'judul.required' => 'Judul wajib diisi.',
            'judul.string' => 'Judul harus berupa teks.',
            'judul.max' => 'Judul maksimal 255 karakter.',
            'kategori.required' => 'Kategori wajib diisi.',
            'kategori.string' => 'Kategori harus berupa teks.',
            'deskripsi.string' => 'Deskripsi harus berupa teks.',
            'jumlah.required' => 'Jumlah wajib diisi.',
            'jumlah.numeric' => 'Jumlah harus berupa angka.',
            'tanggal.required' => 'Tanggal wajib diisi.',
            'tanggal.date' => 'Tanggal tidak valid.',
            'bukti_path.image' => 'Bukti harus berupa gambar.',
            'bukti_path.max' => 'Ukuran bukti maksimal 5MB.',
            'id_profil.exists' => 'Profil tidak ditemukan.',
        ];
    }
}
