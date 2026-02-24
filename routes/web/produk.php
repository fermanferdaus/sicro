<?php

use App\Http\Controllers\ProdukController;
use Illuminate\Support\Facades\Route;

Route::prefix('produk')
    ->name('produk.')
    ->controller(ProdukController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{produk}/edit', 'edit')->name('edit');
        Route::put('/{produk}', 'update')->name('update');
        Route::delete('/{produk}', 'destroy')->name('destroy');
    });
