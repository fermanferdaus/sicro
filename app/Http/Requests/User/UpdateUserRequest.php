<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $user = $this->route('user');
        $userId = is_object($user) ? $user->id_user : $user;

        return [
            'username' => 'sometimes|string|unique:users,username,' . $userId . ',id_user|max:255',
            'nama_lengkap' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $userId . ',id_user|max:255',
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|in:owner,kasir',
            'id_pegawai' => [
                function ($attribute, $value, $fail) use ($userId) {
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
                            ->where('id_user', '!=', $userId)
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
            'username.string' => 'Username harus berupa teks.',
            'username.unique' => 'Username sudah digunakan.',
            'username.max' => 'Username maksimal 255 karakter.',

            'nama_lengkap.string' => 'Nama lengkap harus berupa teks.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',

            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'email.max' => 'Email maksimal 255 karakter.',

            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password minimal 8 karakter.',

            'role.in' => 'Hak akses harus owner atau kasir.',

            'id_pegawai.exists' => 'Data pegawai tidak ditemukan.',
        ];
    }
}
