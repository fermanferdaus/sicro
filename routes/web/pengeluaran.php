<?php

use App\Http\Controllers\PengeluaranController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('pengeluaran')
    ->name('pengeluaran.')
    ->controller(PengeluaranController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{pengeluaran}/edit', 'edit')->name('edit');
        Route::put('/{pengeluaran}', 'update')->name('update');
        Route::delete('/{pengeluaran}', 'destroy')->name('destroy');
    });
