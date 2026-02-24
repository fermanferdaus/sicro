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
        Schema::create('gajis', function (Blueprint $table) {
            $table->uuid('id_gaji')->primary();
            $table->uuid('id_pegawai');
            $table->string('periode');
            $table->decimal('gaji_pokok', 12, 2);
            $table->decimal('total_bonus', 12, 2);
            $table->decimal('total_gaji', 12, 2);
            $table->enum('status', ['draft', 'dibayar']);
            $table->date('tanggal_bayar')->nullable();
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
        Schema::dropIfExists('gajis');
    }
};
