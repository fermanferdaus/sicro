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
        Schema::table('pengeluarans', function (Blueprint $table) {
            $table->string('judul')->after('id_pengeluaran');
            $table->foreignUuid('id_profil')->nullable()->after('tanggal')->constrained('profils', 'id_profil')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengeluarans', function (Blueprint $table) {
            $table->dropForeign(['id_profil']);
            $table->dropColumn(['judul', 'id_profil']);
        });
    }
};
