<?php

namespace Database\Seeders;

use App\Models\Profil;
use Illuminate\Database\Seeder;

class ProfilSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profil = Profil::first();

        if ($profil) {
            $profil->update([
                'alamat' => 'Jl. Kaliurang KM 14.5, Yogyakarta',
            ]);
        } else {
            Profil::create([
                'nama_store' => 'Chicken Crunchy Roll',
                'nama_owner' => 'ferman ferdaus',
                'alamat' => 'Jl. Kaliurang KM 14.5, Yogyakarta',
                'logo' => 'logo/LogoTransparan.png',
                'telepon' => '081234567890',
                'instagram' => '@chickencrunchyroll',
                'tiktok' => '@chickencrunchyroll',
            ]);
        }
    }
}
