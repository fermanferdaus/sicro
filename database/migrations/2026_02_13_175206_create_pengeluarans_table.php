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
        Schema::create('pengeluarans', function (Blueprint $table) {
            $table->uuid('id_pengeluaran')->primary();
            $table->string('kategori');
            $table->text('deskripsi');
            $table->decimal('jumlah', 12, 2);
            $table->string('bukti_path')->nullable();
            $table->date('tanggal');
            $table->uuid('created_by');
            $table->timestamps();

            $table->foreign('created_by')
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
        Schema::dropIfExists('pengeluarans');
    }
};
