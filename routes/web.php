<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    // Temporary Image Upload
    Route::post('/upload-temp-image', [\App\Http\Controllers\TempImageController::class, 'upload'])->name('upload.temp');

    // Dashboard
    require __DIR__ . '/web/dashboard.php';

    // Transaksi
    require __DIR__ . '/web/transaksi.php';

    // Produk
    require __DIR__ . '/web/produk.php';

    // Setting
    require __DIR__ . '/web/setting.php';

    // Laporan
    require __DIR__ . '/web/laporan.php';

    // Pengeluaran
    require __DIR__ . '/web/pengeluaran.php';

    // Account
    require __DIR__ . '/web/account.php';

    // Pegawai
    require __DIR__ . '/web/pegawai.php';

    // Gaji
    require __DIR__ . '/web/gaji.php';

    // Bonus
    require __DIR__ . '/web/bonus.php';

    // Profil
    require __DIR__ . '/web/profil.php';
});