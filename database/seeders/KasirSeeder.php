<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;

class KasirSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if user exists to avoid duplicates
        if (!User::where('username', 'kasir')->exists()) {
            User::create([
                'id_user' => Str::uuid(),
                'username' => 'kasir',
                'email' => 'kasir@sicro.com',
                'password' => bcrypt('admin123'),
                'role' => 'kasir',
                'nama_lengkap' => 'Kasir Sicro',
            ]);
        }
    }
}
