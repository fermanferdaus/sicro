<?php

use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;

Route::prefix('laporan')
    ->name('laporan.')
    ->controller(LaporanController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/penjualan', 'penjualan')->name('penjualan');
        Route::get('/produk', 'produk')->name('produk');
        Route::get('/laba-rugi', 'labaRugi')->name('laba-rugi');
    });
