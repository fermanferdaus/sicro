<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Update gajis table
        Schema::table('gajis', function (Blueprint $table) {
            $table->dropForeign(['id_pegawai']);
        });

        // Data migration for gajis
        // We need to change id_pegawai (which currently stores id_user) 
        // back to the actual id_pegawai from pegawais table
        $gajis = DB::table('gajis')->get();
        foreach ($gajis as $gaji) {
            $pegawai = DB::table('pegawais')->where('id_user', $gaji->id_pegawai)->first();
            if ($pegawai) {
                DB::table('gajis')->where('id_gaji', $gaji->id_gaji)->update([
                    'id_pegawai' => $pegawai->id_pegawai
                ]);
            }
        }

        Schema::table('gajis', function (Blueprint $table) {
            $table->foreign('id_pegawai')
                ->references('id_pegawai')
                ->on('pegawais')
                ->onDelete('cascade');
        });

        // Update bonus table
        Schema::table('bonus', function (Blueprint $table) {
            $table->dropForeign(['id_pegawai']);
        });

        // Data migration for bonus
        $bonuses = DB::table('bonus')->get();
        foreach ($bonuses as $bonus) {
            $pegawai = DB::table('pegawais')->where('id_user', $bonus->id_pegawai)->first();
            if ($pegawai) {
                DB::table('bonus')->where('id_bonus', $bonus->id_bonus)->update([
                    'id_pegawai' => $pegawai->id_pegawai
                ]);
            }
        }

        Schema::table('bonus', function (Blueprint $table) {
            $table->foreign('id_pegawai')
                ->references('id_pegawai')
                ->on('pegawais')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        // Revert bonus table
        Schema::table('bonus', function (Blueprint $table) {
            $table->dropForeign(['id_pegawai']);
        });

        Schema::table('bonus', function (Blueprint $table) {
            $table->foreign('id_pegawai')
                ->references('id_user')
                ->on('users')
                ->onDelete('cascade');
        });

        // Revert gajis table
        Schema::table('gajis', function (Blueprint $table) {
            $table->dropForeign(['id_pegawai']);
        });

        Schema::table('gajis', function (Blueprint $table) {
            $table->foreign('id_pegawai')
                ->references('id_user')
                ->on('users')
                ->onDelete('cascade');
        });
    }
};
