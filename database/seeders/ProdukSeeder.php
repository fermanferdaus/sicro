<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \App\Models\Produk::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $samples = [
            [
                'nama_produk' => 'Original Crunchy Roll',
                'harga_jual' => 25000,
                'gambar' => 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Spicy Dynamite Roll',
                'harga_jual' => 28000,
                'gambar' => 'https://images.unsplash.com/photo-1541592103007-ce9a133a80a5?q=80&w=2070&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Cheesy Lava Crunchy',
                'harga_jual' => 30000,
                'gambar' => null, // No image test
            ],
            [
                'nama_produk' => 'Classic Iced Tea',
                'harga_jual' => 8000,
                'gambar' => null, // No image test
            ],
            [
                'nama_produk' => 'Salted Egg Special',
                'harga_jual' => 32000,
                'gambar' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop',
            ],
        ];

        foreach ($samples as $sample) {
            \App\Models\Produk::create($sample);
        }
    }
}
