<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            // Drop old foreign key
            $table->dropForeign(['id_kasir']);

            // Rename column
            $table->renameColumn('id_kasir', 'id_user');
        });

        Schema::table('transaksis', function (Blueprint $table) {
            // Add new foreign key
            $table->foreign('id_user')
                ->references('id_user')
                ->on('users')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropForeign(['id_user']);
            $table->renameColumn('id_user', 'id_kasir');
        });

        Schema::table('transaksis', function (Blueprint $table) {
            $table->foreign('id_kasir')
                ->references('id_user')
                ->on('users')
                ->onDelete('set null');
        });
    }
};
