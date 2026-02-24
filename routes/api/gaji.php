<?php

use App\Http\Controllers\GajiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api', 'role:owner'])
    ->prefix('gaji')
    ->name('api.gaji.')
    ->controller(GajiController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{gaji}', 'update')->name('update');
        Route::delete('/{gaji}', 'destroy')->name('destroy');
    });
