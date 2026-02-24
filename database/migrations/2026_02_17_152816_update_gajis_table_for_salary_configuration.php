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
        Schema::table('gajis', function (Blueprint $table) {
            $table->dropColumn(['periode', 'total_bonus', 'total_gaji', 'status', 'tanggal_bayar']);
            $table->enum('tipe_gaji', ['harian', 'mingguan', 'bulanan'])->after('gaji_pokok');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gajis', function (Blueprint $table) {
            $table->dropColumn('tipe_gaji');
            $table->string('periode')->after('id_pegawai');
            $table->decimal('total_bonus', 12, 2)->after('gaji_pokok');
            $table->decimal('total_gaji', 12, 2)->after('total_bonus');
            $table->enum('status', ['draft', 'dibayar'])->after('total_gaji');
            $table->date('tanggal_bayar')->nullable()->after('status');
        });
    }
};
