<?php

use App\Http\Controllers\ProfilController;
use Illuminate\Support\Facades\Route;

Route::prefix('profil')
    ->name('profil.')
    ->middleware('role:owner')
    ->controller(ProfilController::class)
    ->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'update')->name('update');
    });
