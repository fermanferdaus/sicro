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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->uuid('id_transaksi')->primary();

            $table->uuid('id_kasir');

            $table->string('kategori');
            $table->enum('metode_bayar', ['cash', 'qris']);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('jumlah_bayar', 12, 2);
            $table->decimal('kembalian', 12, 2);
            $table->dateTime('tanggal');
            $table->timestamps();

            $table->foreign('id_kasir')
                ->references('id_user')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
