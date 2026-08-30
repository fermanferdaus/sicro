<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pegawai;
use App\Models\Bonus;
use Carbon\Carbon;

class BonusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $currentPeriod = Carbon::now()->format('Y-m');

        $bonusData = [
            [
                'kode_pegawai' => 'PGW-0001',
                'judul' => 'Bonus Target Penjualan Kasir',
                'jumlah' => 350000,
                'keterangan' => 'Mencapai target transaksi 500 order bulan ini',
                'periode' => $currentPeriod,
                'status' => 'disetujui',
            ],
            [
                'kode_pegawai' => 'PGW-0001',
                'judul' => 'Bonus Kedisiplinan & Absensi',
                'jumlah' => 150000,
                'keterangan' => 'Kehadiran 100% tanpa terlambat',
                'periode' => $currentPeriod,
                'status' => 'pending',
            ],
            [
                'kode_pegawai' => 'PGW-0002',
                'judul' => 'Bonus Efisiensi Dapur & Rasa',
                'jumlah' => 500000,
                'keterangan' => 'Peningkatan standar kecepatan penyajian dan zero waste',
                'periode' => $currentPeriod,
                'status' => 'disetujui',
            ],
            [
                'kode_pegawai' => 'PGW-0003',
                'judul' => 'Bonus Lembur Event Weekend',
                'jumlah' => 200000,
                'keterangan' => 'Shift tambahan saat event festival kuliner UMKM',
                'periode' => $currentPeriod,
                'status' => 'disetujui',
            ],
            [
                'kode_pegawai' => 'PGW-0004',
                'judul' => 'Bonus Kinerja Mingguan',
                'jumlah' => 100000,
                'keterangan' => 'Pelayanan ramah dan kebersihan area makan',
                'periode' => $currentPeriod,
                'status' => 'pending',
            ],
        ];

        foreach ($bonusData as $item) {
            $pegawai = Pegawai::where('kode_pegawai', $item['kode_pegawai'])->first();
            if ($pegawai) {
                Bonus::updateOrCreate(
                    [
                        'id_pegawai' => $pegawai->id_pegawai,
                        'judul' => $item['judul'],
                        'periode' => $item['periode'],
                    ],
                    [
                        'jumlah' => $item['jumlah'],
                        'keterangan' => $item['keterangan'],
                        'status' => $item['status'],
                    ]
                );
            }
        }
    }
}
