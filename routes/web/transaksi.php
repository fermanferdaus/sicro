<?php

use App\Http\Controllers\TransaksiController;
use Illuminate\Support\Facades\Route;

Route::controller(TransaksiController::class)->group(function () {
    Route::prefix('transaksi')->name('transaksi.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/qris', 'qris')->name('qris');
        Route::post('/', 'store')->name('store');
    });

    Route::prefix('riwayat-transaksi')->name('transaksi.')->group(function () {
        Route::get('/', 'history')->name('history');
        Route::get('/{transaksi}', 'show')->name('show');
    });
});
