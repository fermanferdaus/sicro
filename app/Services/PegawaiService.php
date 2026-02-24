<?php

namespace App\Services;

use App\Models\Pegawai;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PegawaiService
{
    public function getAll($search = null)
    {
        $query = Pegawai::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        return $query->latest()->get();
    }

    public function create(array $data)
    {
        if (isset($data['foto_path']) && $data['foto_path'] instanceof UploadedFile) {
            $data['foto_path'] = $this->handleUpload($data['foto_path']);
        }

        return Pegawai::create([
            'nama_lengkap' => $data['nama_lengkap'],
            'email' => $data['email'] ?? null,
            'alamat' => $data['alamat'] ?? null,
            'nomor_telepon' => $data['nomor_telepon'] ?? null,
            'tanggal_lahir' => $data['tanggal_lahir'] ?? null,
            'jenis_kelamin' => $data['jenis_kelamin'] ?? null,
            'foto_path' => $data['foto_path'] ?? null,
        ]);
    }

    public function getById($id)
    {
        return Pegawai::with('user')->findOrFail($id);
    }

    public function update(Pegawai $pegawai, array $data)
    {
        if (isset($data['foto_path']) && $data['foto_path'] instanceof UploadedFile) {
            $data['foto_path'] = $this->handleUpload($data['foto_path'], $pegawai->foto_path);
        } elseif (array_key_exists('foto_path', $data) && $data['foto_path'] === null) {
            // If specifically set to null, delete the old image
            if ($pegawai->foto_path) {
                $this->deleteFile($pegawai->foto_path);
            }
            $data['foto_path'] = null;
        } else {
            // Keep existing photo if not provided or invalid
            unset($data['foto_path']);
        }

        $pegawai->update($data);

        return $pegawai->fresh('user');
    }

    public function delete(Pegawai $pegawai)
    {
        $userId = $pegawai->id_user;

        if ($pegawai->foto_path) {
            $this->deleteFile($pegawai->foto_path);
        }

        // 1. Delete the Pegawai record first
        $pegawai->delete();

        // 2. Then delete the associated user account
        // This will trigger cascading deletes for Gaji and Bonus in the database
        if ($userId) {
            $user = User::find($userId);
            if ($user) {
                return $user->delete();
            }
        }

        return true;
    }

    private function handleUpload(UploadedFile $file, $oldPath = null)
    {
        $filename = Str::uuid() . '.webp';
        $path = 'pegawai/' . $filename;

        $image = Image::read($file);
        $image->scale(width: 800);

        Storage::disk('public')->put($path, $image->toWebp(80));

        if ($oldPath) {
            $this->deleteFile($oldPath);
        }

        return '/storage/' . $path;
    }

    private function deleteFile($path)
    {
        $cleanPath = str_replace('/storage/', '', $path);
        if (Storage::disk('public')->exists($cleanPath)) {
            Storage::disk('public')->delete($cleanPath);
        }
    }
}
