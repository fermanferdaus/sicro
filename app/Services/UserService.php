<?php

namespace App\Services;

use App\Models\User;
use App\Models\Pegawai;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function getAll($search = null)
    {
        $query = User::with('pegawai');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', '%' . $search . '%')
                    ->orWhere('username', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        return $query->latest()->get();
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'username' => $data['username'],
                'nama_lengkap' => $data['nama_lengkap'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
            ]);

            // If account is linked to a pegawai
            if (!empty($data['id_pegawai'])) {
                $pegawai = Pegawai::findOrFail($data['id_pegawai']);
                $pegawai->update(['id_user' => $user->id_user]);
            }

            return $user;
        });
    }

    public function update(User $user, array $data)
    {
        return DB::transaction(function () use ($user, $data) {
            $userData = [
                'username' => $data['username'] ?? $user->username,
                'nama_lengkap' => $data['nama_lengkap'] ?? $user->nama_lengkap,
                'email' => $data['email'] ?? $user->email,
                'role' => $data['role'] ?? $user->role,
            ];

            if (!empty($data['password'])) {
                $userData['password'] = Hash::make($data['password']);
            }

            $user->update($userData);

            // Handle Pegawai linkage
            if (isset($data['id_pegawai'])) {
                // Remove old linkage if exists
                Pegawai::where('id_user', $user->id_user)->update(['id_user' => null]);

                if (!empty($data['id_pegawai'])) {
                    $pegawai = Pegawai::findOrFail($data['id_pegawai']);
                    $pegawai->update(['id_user' => $user->id_user]);
                }
            }

            return $user->fresh('pegawai');
        });
    }

    public function delete(User $user)
    {
        return DB::transaction(function () use ($user) {
            // Unlink any pegawai
            Pegawai::where('id_user', $user->id_user)->update(['id_user' => null]);

            return $user->delete();
        });
    }

    public function updateProfile(User $user, array $data): User
    {
        // Handle password update logic
        if (isset($data['password']) && filled($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Handle foto_profile logic (delegated to Observer via model attribute assignment)
        if (array_key_exists('foto_profile', $data)) {
            $user->foto_profile = $data['foto_profile'];
            unset($data['foto_profile']);
        } elseif (!empty($data['delete_foto_profile'])) {
            $user->foto_profile = null;
        }

        if (isset($data['delete_foto_profile'])) {
            unset($data['delete_foto_profile']);
        }

        $user->fill($data);
        $user->save();

        return $user;
    }
}
