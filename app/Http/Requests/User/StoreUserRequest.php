<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'username' => 'required|string|unique:users,username|max:255',
            'nama_lengkap' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
            'role' => 'required|in:owner,kasir',
            'id_pegawai' => [
                function ($attribute, $value, $fail) {
                    if ($this->role !== 'owner' && empty($value)) {
                        $fail('Data pegawai wajib ditautkan untuk role selain owner.');
                        return;
                    }

                    if (!empty($value)) {
                        // Check exists
                        $exists = \App\Models\Pegawai::where('id_pegawai', $value)->exists();
                        if (!$exists) {
                            $fail('Data pegawai tidak ditemukan.');
                            return;
                        }

                        // Check uniqueness
                        $alreadyLinked = \App\Models\Pegawai::where('id_pegawai', $value)
                            ->whereNotNull('id_user')
                            ->exists();

                        if ($alreadyLinked) {
                            $fail('Pegawai ini sudah memiliki akun pengguna.');
                        }
                    }
                },
            ],
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'Username wajib diisi.',
            'username.string' => 'Username harus berupa teks.',
            'username.unique' => 'Username sudah digunakan.',
            'username.max' => 'Username maksimal 255 karakter.',

            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.string' => 'Nama lengkap harus berupa teks.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',

            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'email.max' => 'Email maksimal 255 karakter.',

            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal 8 karakter.',

            'role.required' => 'Hak akses wajib diisi.',
            'role.in' => 'Hak akses harus owner atau kasir.',

            'id_pegawai.exists' => 'Data pegawai tidak ditemukan.',
            'id_pegawai.required' => 'Pegawai wajib dipilih untuk kasir.',
        ];
    }
}
