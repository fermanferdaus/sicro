<?php

namespace App\Http\Requests\Pegawai;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePegawaiRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $pegawai = $this->route('pegawai');
        $pegawaiId = is_object($pegawai) ? $pegawai->id_pegawai : $pegawai;

        return [
            'nama_lengkap' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:pegawais,email,' . $pegawaiId . ',id_pegawai|max:255',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:20',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'foto_path' => 'nullable|image|max:5120',
        ];
    }

    public function messages()
    {
        return [
            'nama_lengkap.string' => 'Nama lengkap harus berupa teks.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'email.max' => 'Email maksimal 255 karakter.',
            'alamat.string' => 'Alamat harus berupa teks.',
            'nomor_telepon.string' => 'Nomor telepon harus berupa teks.',
            'nomor_telepon.max' => 'Nomor telepon maksimal 20 karakter.',
            'tanggal_lahir.date' => 'Tanggal lahir tidak valid.',
            'jenis_kelamin.in' => 'Jenis kelamin harus L atau P.',
            'foto_path.image' => 'Foto harus berupa gambar.',
            'foto_path.max' => 'Ukuran foto maksimal 5MB.',
        ];
    }
}
