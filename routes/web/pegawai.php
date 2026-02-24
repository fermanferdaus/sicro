<?php

use App\Http\Controllers\PegawaiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:owner'])
    ->prefix('pegawai')
    ->name('pegawai.')
    ->controller(PegawaiController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{pegawai}/edit', 'edit')->name('edit');
        Route::put('/{pegawai}', 'update')->name('update');
        Route::delete('/{pegawai}', 'destroy')->name('destroy');
    });
