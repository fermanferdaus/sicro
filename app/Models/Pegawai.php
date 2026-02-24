<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pegawai extends Model
{
    use HasFactory;

    protected $table = 'pegawais';
    protected $primaryKey = 'id_pegawai';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_user',
        'kode_pegawai',
        'nama_lengkap',
        'email',
        'alamat',
        'nomor_telepon',
        'tanggal_lahir',
        'jenis_kelamin',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }

            if (empty($model->kode_pegawai)) {
                $lastPegawai = static::where('kode_pegawai', 'like', 'PGW-%')
                    ->orderBy('kode_pegawai', 'desc')
                    ->first();

                $lastNumber = 0;
                if ($lastPegawai) {
                    $lastNumber = (int) str_replace('PGW-', '', $lastPegawai->kode_pegawai);
                }

                $model->kode_pegawai = 'PGW-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * RELATIONS
     */

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function gajis()
    {
        return $this->hasMany(Gaji::class, 'id_pegawai', 'id_pegawai');
    }

    public function bonus()
    {
        return $this->hasMany(Bonus::class, 'id_pegawai', 'id_pegawai');
    }
}
