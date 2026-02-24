<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('pegawais', 'kode_pegawai')) {
            Schema::table('pegawais', function (Blueprint $table) {
                $table->string('kode_pegawai')->nullable()->unique()->after('id_user');
            });
        }

        // Backfill existing data using direct DB queries to bypass model constraints
        $pegawais = DB::table('pegawais')->orderBy('created_at', 'asc')->get();
        foreach ($pegawais as $index => $pegawai) {
            DB::table('pegawais')
                ->where('id_pegawai', $pegawai->id_pegawai)
                ->update([
                    'kode_pegawai' => 'EMP-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT)
                ]);
        }

        Schema::table('pegawais', function (Blueprint $table) {
            $table->string('kode_pegawai')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('pegawais', function (Blueprint $table) {
            $table->dropColumn('kode_pegawai');
        });
    }
};
