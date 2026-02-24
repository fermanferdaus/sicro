<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Faktur extends Model
{
    protected $table = 'fakturs';
    protected $primaryKey = 'id_faktur';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_faktur',
        'id_transaksi',
        'nomor_faktur',
        'tanggal_cetak'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_faktur) {
                $model->id_faktur = Str::uuid()->toString();
            }
        });
    }

    // Relasi ke transaksi
    public function transaksi()
    {
        return $this->belongsTo(Transaksi::class, 'id_transaksi', 'id_transaksi');
    }
}
