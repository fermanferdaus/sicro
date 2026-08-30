<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Akun Owner
        User::updateOrCreate(
            ['username' => 'owner'],
            [
                'email' => 'owner@sicro.com',
                'password' => Hash::make('admin123'),
                'role' => 'owner',
                'nama_lengkap' => 'Ferman Ferdaus',
            ]
        );

        // 2. Akun Kasir
        User::updateOrCreate(
            ['username' => 'kasir'],
            [
                'email' => 'kasir@sicro.com',
                'password' => Hash::make('admin123'),
                'role' => 'kasir',
                'nama_lengkap' => 'Siti Rahma',
            ]
        );
    }
}
