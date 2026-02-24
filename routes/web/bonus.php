<?php

use App\Http\Controllers\BonusController;
use Illuminate\Support\Facades\Route;

Route::prefix('bonus')
    ->name('bonus.')
    ->controller(BonusController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{bonus}/edit', 'edit')->name('edit');
        Route::put('/{bonus}', 'update')->name('update');
        Route::delete('/{bonus}', 'destroy')->name('destroy');
        Route::patch('/{bonus}/status', 'updateStatus')->name('update-status');
    });
