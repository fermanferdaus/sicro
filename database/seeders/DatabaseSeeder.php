<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProfilSeeder::class,
            UserSeeder::class,
            PegawaiSeeder::class,
            GajiSeeder::class,
            BonusSeeder::class,
            ProdukSeeder::class,
            PengeluaranSeeder::class,
            TransaksiSeeder::class,
        ]);
    }
}
