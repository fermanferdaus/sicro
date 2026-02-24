<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("UPDATE pegawais SET kode_pegawai = REPLACE(kode_pegawai, 'EMP-', 'PGW-')");
    }

    public function down(): void
    {
        DB::statement("UPDATE pegawais SET kode_pegawai = REPLACE(kode_pegawai, 'PGW-', 'EMP-')");
    }
};
