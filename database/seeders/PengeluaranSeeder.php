<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengeluaran;
use App\Models\User;
use App\Models\Profil;
use Carbon\Carbon;

class PengeluaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = User::where('role', 'owner')->first();
        $profil = Profil::first();

        $now = Carbon::now();

        $expenses = [
            [
                'judul' => 'Belanja Ayam Fillet & Bahan Segar',
                'kategori' => 'Bahan Baku',
                'deskripsi' => 'Pembelian 30kg dada ayam fillet dan bumbu marinasi',
                'jumlah' => 1250000,
                'tanggal' => $now->copy()->subDays(10)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
            [
                'judul' => 'Restock Minyak Goreng & Tepung Crispy',
                'kategori' => 'Bahan Baku',
                'deskripsi' => 'Beli 4 jerigen minyak goreng 5L dan 50kg tepung bumbu',
                'jumlah' => 820000,
                'tanggal' => $now->copy()->subDays(7)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
            [
                'judul' => 'Tagihan Listrik & PDAM Outlet',
                'kategori' => 'Utilitas',
                'deskripsi' => 'Pembayaran listrik token dan air PDAM bulanan',
                'jumlah' => 750000,
                'tanggal' => $now->copy()->subDays(15)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
            [
                'judul' => 'Pembelian Kotak Kemasan & Cup Minuman',
                'kategori' => 'Operasional',
                'deskripsi' => 'Cetak kotak packaging food grade 1000 pcs dan cup plastik',
                'jumlah' => 680000,
                'tanggal' => $now->copy()->subDays(5)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
            [
                'judul' => 'Servis & Perawatan Deep Fryer Gas',
                'kategori' => 'Pemeliharaan',
                'deskripsi' => 'Pembersihan pipa gas dan penggantian pemantik api kompor fryer',
                'jumlah' => 250000,
                'tanggal' => $now->copy()->subDays(3)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
            [
                'judul' => 'Iuran Kebersihan & Keamanan Kawasan',
                'kategori' => 'Operasional',
                'deskripsi' => 'Retribusi sampah dan keamanan lingkungan ruko',
                'jumlah' => 150000,
                'tanggal' => $now->copy()->subDays(18)->toDateString(),
                'created_by' => $owner?->id_user,
                'id_profil' => $profil?->id_profil,
            ],
        ];

        foreach ($expenses as $data) {
            Pengeluaran::updateOrCreate(
                [
                    'judul' => $data['judul'],
                    'tanggal' => $data['tanggal'],
                ],
                $data
            );
        }
    }
}
