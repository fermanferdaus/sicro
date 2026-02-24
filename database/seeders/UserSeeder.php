<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'id_user' => Str::uuid(),
            'username' => 'owner',
            'email' => 'owner@sicro.com',
            'password' => bcrypt('admin123'),
            'role' => 'owner',
            'nama_lengkap' => 'Ferman Ferdaus',
        ]);
    }
}
