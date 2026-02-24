<?php

use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('setting')
    ->name('setting.')
    ->controller(SettingController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::put('/', 'update')->name('update');
    });
