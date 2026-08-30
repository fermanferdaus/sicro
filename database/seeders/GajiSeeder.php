<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pegawai;
use App\Models\Gaji;

class GajiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gajiConfig = [
            'PGW-0001' => [
                'gaji_pokok' => 2500000,
                'tipe_gaji' => 'bulanan',
            ],
            'PGW-0002' => [
                'gaji_pokok' => 2800000,
                'tipe_gaji' => 'bulanan',
            ],
            'PGW-0003' => [
                'gaji_pokok' => 90000,
                'tipe_gaji' => 'harian',
            ],
            'PGW-0004' => [
                'gaji_pokok' => 600000,
                'tipe_gaji' => 'mingguan',
            ],
        ];

        foreach ($gajiConfig as $kode => $config) {
            $pegawai = Pegawai::where('kode_pegawai', $kode)->first();
            if ($pegawai) {
                Gaji::updateOrCreate(
                    ['id_pegawai' => $pegawai->id_pegawai],
                    [
                        'gaji_pokok' => $config['gaji_pokok'],
                        'tipe_gaji' => $config['tipe_gaji'],
                    ]
                );
            }
        }
    }
}
