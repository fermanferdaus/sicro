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
        Schema::create('fakturs', function (Blueprint $table) {
            $table->uuid('id_faktur')->primary();
            $table->uuid('id_transaksi');
            $table->string('nomor_faktur')->unique();
            $table->dateTime('tanggal_cetak');
            $table->timestamps();

            $table->foreign('id_transaksi')
                ->references('id_transaksi')
                ->on('transaksis')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fakturs');
    }
};
