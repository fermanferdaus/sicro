<?php

use App\Http\Controllers\ProdukController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('produk')
    ->name('api.produk.')
    ->controller(ProdukController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{produk}', 'update')->name('update');
        Route::delete('/{produk}', 'destroy')->name('destroy');
    });
