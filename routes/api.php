<?php

Route::middleware('throttle:api')->group(function () {
    // Auth Routes
    require __DIR__ . '/api/auth.php';

    // Produk Routes
    require __DIR__ . '/api/produk.php';

    // Transaksi Routes
    require __DIR__ . '/api/transaksi.php';

    // Pengeluaran Routes
    require __DIR__ . '/api/pengeluaran.php';

    // Bonus Routes
    require __DIR__ . '/api/bonus.php';

    // Gaji Routes
    require __DIR__ . '/api/gaji.php';
});
