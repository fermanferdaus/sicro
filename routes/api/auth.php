<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login'])->name('api.login');

Route::middleware('auth:api')
    ->name('api.')
    ->controller(AuthController::class)
    ->group(function () {
        Route::get('/me', 'me')->name('me');
        Route::post('/logout', 'logout')->name('logout');
    });
