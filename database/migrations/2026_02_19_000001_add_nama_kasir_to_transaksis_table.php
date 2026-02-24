<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Add nama_kasir column
            $table->string('nama_kasir')->nullable()->after('id_kasir');

            // Make id_kasir nullable
            $table->uuid('id_kasir')->nullable()->change();

            // Change foreign key to onDelete('set null')
            $table->dropForeign(['id_kasir']);
            $table->foreign('id_kasir')
                ->references('id_user')
                ->on('users')
                ->onDelete('set null');
        });

        // Populate nama_kasir for existing transactions
        DB::table('transaksis')
            ->join('users', 'transaksis.id_kasir', '=', 'users.id_user')
            ->update(['transaksis.nama_kasir' => DB::raw('users.nama_lengkap')]);
    }

    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_kasir']);

            // Revert to non-nullable (might fail if there are nulls, but this is rollback)
            $table->uuid('id_kasir')->nullable(false)->change();

            $table->foreign('id_kasir')
                ->references('id_user')
                ->on('users')
                ->onDelete('cascade');

            $table->dropColumn('nama_kasir');
        });
    }
};
