<?php

namespace App\Http\Requests\Profil;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfilRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nama_store' => 'required|string|max:255',
            'alamat' => 'nullable|string',
            'nama_owner' => 'required|string|max:255',
            'logo' => 'nullable|string',
            'telepon' => 'required|string|max:20',
            'instagram' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'delete_logo' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'nama_store.required' => 'Nama store wajib diisi.',
            'nama_owner.required' => 'Nama owner wajib diisi.',
            'telepon.required' => 'Nomor telepon wajib diisi.',
            'logo.image' => 'File harus berupa gambar.',
            'logo.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
