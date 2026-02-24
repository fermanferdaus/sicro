<?php

use App\Http\Controllers\BonusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api', 'role:owner'])
    ->prefix('bonus')
    ->name('api.bonus.')
    ->controller(BonusController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{bonus}', 'update')->name('update');
        Route::delete('/{bonus}', 'destroy')->name('destroy');
    });
