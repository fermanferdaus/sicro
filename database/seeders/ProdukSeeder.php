<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produk;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $samples = [
            // Main Course
            [
                'nama_produk' => 'Original Crunchy Roll',
                'harga_jual' => 25000,
                'kategori' => 'Main Course',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Spicy Dynamite Roll',
                'harga_jual' => 28000,
                'kategori' => 'Main Course',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1541592103007-ce9a133a80a5?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Cheesy Lava Crunchy',
                'harga_jual' => 30000,
                'kategori' => 'Main Course',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Salted Egg Special Roll',
                'harga_jual' => 32000,
                'kategori' => 'Main Course',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'BBQ Smoky Garlic Roll',
                'harga_jual' => 29000,
                'kategori' => 'Main Course',
                'is_active' => true,
                'gambar' => null,
            ],

            // Snack
            [
                'nama_produk' => 'Crispy Chicken Skin',
                'harga_jual' => 18000,
                'kategori' => 'Snack',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'French Fries Extra Crispy',
                'harga_jual' => 15000,
                'kategori' => 'Snack',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop',
            ],

            // Minuman
            [
                'nama_produk' => 'Classic Iced Tea',
                'harga_jual' => 8000,
                'kategori' => 'Minuman',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Lemonade Honey Fizz',
                'harga_jual' => 12000,
                'kategori' => 'Minuman',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
            ],
            [
                'nama_produk' => 'Matcha Latte Ice',
                'harga_jual' => 18000,
                'kategori' => 'Minuman',
                'is_active' => true,
                'gambar' => 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
            ],

            // Paket Combo
            [
                'nama_produk' => 'Combo Hemat Single (Roll + Ice Tea)',
                'harga_jual' => 30000,
                'kategori' => 'Paket Combo',
                'is_active' => true,
                'gambar' => null,
            ],
            [
                'nama_produk' => 'Combo Dynamite Feast (2 Roll + 2 Drink)',
                'harga_jual' => 65000,
                'kategori' => 'Paket Combo',
                'is_active' => true,
                'gambar' => null,
            ],
        ];

        foreach ($samples as $sample) {
            Produk::updateOrCreate(
                ['nama_produk' => $sample['nama_produk']],
                $sample
            );
        }
    }
}
