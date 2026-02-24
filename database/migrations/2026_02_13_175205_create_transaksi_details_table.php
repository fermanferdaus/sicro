<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksi_details', function (Blueprint $table) {
            $table->uuid('id_detail')->primary();
            $table->uuid('id_transaksi');
            $table->uuid('id_produk');
            $table->decimal('harga_satuan', 12, 2);
            $table->integer('qty');
            $table->decimal('total', 12, 2);

            $table->foreign('id_transaksi')
                ->references('id_transaksi')
                ->on('transaksis')
                ->onDelete('cascade');

            $table->foreign('id_produk')
                ->references('id_produk')
                ->on('produks')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_details');
    }
};
