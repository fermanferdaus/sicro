<?php

namespace App\Services;

use App\Models\Profil;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfilService
{
    public function getProfil()
    {
        return Profil::first();
    }

    public function updateProfil(array $data)
    {
        $profil = Profil::first();

        // If no profile exists, create a new one (though one should exist from seeders)
        if (!$profil) {
            $profil = new Profil();
            $profil->id_profil = (string) Str::uuid();
        }

        if (isset($data['logo']) && $data['logo'] instanceof \Illuminate\Http\UploadedFile) {
            // Delete old logo if exists
            if ($profil->logo) {
                $oldPath = str_replace('/storage/', '', $profil->logo);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new logo
            $path = $data['logo']->store('store', 'public');
            $data['logo'] = Storage::url($path);
        } elseif (isset($data['logo']) && is_string($data['logo']) && str_starts_with($data['logo'], 'temp/')) {
            // Delete old logo if exists
            if ($profil->logo) {
                $oldPath = str_replace('/storage/', '', $profil->logo);
                Storage::disk('public')->delete($oldPath);
            }

            // Move file from temp to final
            $finalPath = 'store/' . str_replace('temp/', '', $data['logo']);
            Storage::disk('public')->move($data['logo'], $finalPath);
            $data['logo'] = '/storage/' . $finalPath;
        } elseif (isset($data['delete_logo']) && $data['delete_logo'] == true) {
            if ($profil->logo) {
                $oldPath = str_replace('/storage/', '', $profil->logo);
                Storage::disk('public')->delete($oldPath);
            }
            $data['logo'] = null;
        } else {
            // Keep existing logo if not changed
            unset($data['logo']);
        }

        unset($data['delete_logo']);

        $profil->fill($data);
        $profil->save();

        return $profil;
    }
}
