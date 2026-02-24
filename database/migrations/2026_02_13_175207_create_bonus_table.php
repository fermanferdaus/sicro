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
        Schema::create('bonus', function (Blueprint $table) {
            $table->uuid('id_bonus')->primary();
            $table->uuid('id_pegawai');
            $table->string('judul');
            $table->decimal('jumlah', 12, 2);
            $table->text('keterangan');
            $table->string('periode');
            $table->enum('status', ['pending', 'disetujui', 'ditolak']);
            $table->timestamps();

            $table->foreign('id_pegawai')
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
        Schema::dropIfExists('bonus');
    }
};
