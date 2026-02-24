<?php

use App\Http\Controllers\GajiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:owner'])
    ->prefix('gaji')
    ->name('gaji.')
    ->controller(GajiController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{gaji}/edit', 'edit')->name('edit');
        Route::put('/{gaji}', 'update')->name('update');
        Route::delete('/{gaji}', 'destroy')->name('destroy');
    });
