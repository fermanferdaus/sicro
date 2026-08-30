<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pegawai;
use App\Models\User;

class PegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kasirUser = User::where('username', 'kasir')->first();

        $pegawais = [
            [
                'nama_lengkap' => 'Siti Rahma',
                'email' => 'siti.rahma@sicro.com',
                'kode_pegawai' => 'PGW-0001',
                'alamat' => 'Jl. Gejayan No. 12, Sleman, Yogyakarta',
                'nomor_telepon' => '081234567801',
                'tanggal_lahir' => '1998-05-14',
                'jenis_kelamin' => 'P',
                'id_user' => $kasirUser?->id_user,
            ],
            [
                'nama_lengkap' => 'Budi Santoso',
                'email' => 'budi.santoso@sicro.com',
                'kode_pegawai' => 'PGW-0002',
                'alamat' => 'Jl. Kaliurang KM 10, Sleman, Yogyakarta',
                'nomor_telepon' => '081234567802',
                'tanggal_lahir' => '1995-11-20',
                'jenis_kelamin' => 'L',
                'id_user' => null,
            ],
            [
                'nama_lengkap' => 'Andi Pratama',
                'email' => 'andi.pratama@sicro.com',
                'kode_pegawai' => 'PGW-0003',
                'alamat' => 'Jl. Monjali No. 45, Sleman, Yogyakarta',
                'nomor_telepon' => '081234567803',
                'tanggal_lahir' => '2000-02-18',
                'jenis_kelamin' => 'L',
                'id_user' => null,
            ],
            [
                'nama_lengkap' => 'Dewi Lestari',
                'email' => 'dewi.lestari@sicro.com',
                'kode_pegawai' => 'PGW-0004',
                'alamat' => 'Jl. Palagan KM 8, Sleman, Yogyakarta',
                'nomor_telepon' => '081234567804',
                'tanggal_lahir' => '1999-08-09',
                'jenis_kelamin' => 'P',
                'id_user' => null,
            ],
        ];

        foreach ($pegawais as $data) {
            Pegawai::updateOrCreate(
                ['kode_pegawai' => $data['kode_pegawai']],
                $data
            );
        }
    }
}
