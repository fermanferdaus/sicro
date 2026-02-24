<?php

use App\Http\Controllers\PengeluaranController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api', 'role:owner'])
    ->prefix('pengeluaran')
    ->name('api.pengeluaran.')
    ->controller(PengeluaranController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{pengeluaran}', 'update')->name('update');
        Route::delete('/{pengeluaran}', 'destroy')->name('destroy');
    });
