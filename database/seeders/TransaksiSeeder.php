<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\TransaksiDetail;
use App\Models\Faktur;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TransaksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kasirUser = User::where('role', 'kasir')->first() ?? User::where('role', 'owner')->first();
        $produks = Produk::where('is_active', true)->get();

        if ($produks->isEmpty() || !$kasirUser) {
            return;
        }

        $now = Carbon::now();

        // Generate sample transactions spread over the past 14 days up to today
        $days = 14;
        $orderCount = 1;

        for ($d = $days; $d >= 0; $d--) {
            $currentDate = $now->copy()->subDays($d);
            
            // Random transactions per day: between 2 and 5 transactions
            $txCountToday = ($d === 0) ? 4 : rand(2, 4);

            for ($i = 0; $i < $txCountToday; $i++) {
                $txTime = $currentDate->copy()->setHour(rand(10, 21))->setMinute(rand(0, 59))->setSecond(rand(0, 59));
                
                // Pick 1 to 3 random distinct products
                $pickedProduks = $produks->random(min(rand(1, 3), $produks->count()));
                $subtotal = 0;
                $detailsData = [];

                foreach ($pickedProduks as $prod) {
                    $qty = rand(1, 3);
                    $lineTotal = $prod->harga_jual * $qty;
                    $subtotal += $lineTotal;

                    $detailsData[] = [
                        'id_produk' => $prod->id_produk,
                        'harga_satuan' => $prod->harga_jual,
                        'qty' => $qty,
                        'total' => $lineTotal,
                    ];
                }

                $metodeBayar = (rand(0, 1) === 1) ? 'qris' : 'cash';
                $kategoriList = ['Dine In', 'Take Away', 'Delivery'];
                $kategori = $kategoriList[array_rand($kategoriList)];

                $jumlahBayar = ($metodeBayar === 'qris') 
                    ? $subtotal 
                    : ceil($subtotal / 10000) * 10000;
                if ($jumlahBayar < $subtotal) {
                    $jumlahBayar = $subtotal + 10000;
                }
                $kembalian = $jumlahBayar - $subtotal;

                $idTransaksi = Str::uuid()->toString();

                $transaksi = Transaksi::create([
                    'id_transaksi' => $idTransaksi,
                    'id_user' => $kasirUser->id_user,
                    'nama_kasir' => $kasirUser->nama_lengkap,
                    'kategori' => $kategori,
                    'metode_bayar' => $metodeBayar,
                    'subtotal' => $subtotal,
                    'jumlah_bayar' => $jumlahBayar,
                    'kembalian' => $kembalian,
                    'tanggal' => $txTime,
                    'created_at' => $txTime,
                    'updated_at' => $txTime,
                ]);

                foreach ($detailsData as $det) {
                    TransaksiDetail::create([
                        'id_detail' => Str::uuid()->toString(),
                        'id_transaksi' => $transaksi->id_transaksi,
                        'id_produk' => $det['id_produk'],
                        'harga_satuan' => $det['harga_satuan'],
                        'qty' => $det['qty'],
                        'total' => $det['total'],
                    ]);
                }

                $datePart = $txTime->format('ymd');
                $sequence = str_pad($orderCount++, 4, '0', STR_PAD_LEFT);
                $nomorFaktur = "INV/{$datePart}/{$sequence}";

                Faktur::create([
                    'id_faktur' => Str::uuid()->toString(),
                    'id_transaksi' => $transaksi->id_transaksi,
                    'nomor_faktur' => $nomorFaktur,
                    'tanggal_cetak' => $txTime,
                    'created_at' => $txTime,
                    'updated_at' => $txTime,
                ]);
            }
        }
    }
}
