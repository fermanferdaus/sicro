<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksis';
    protected $primaryKey = 'id_transaksi';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_transaksi',
        'nama_kasir',
        'id_user',
        'kategori',
        'metode_bayar',
        'subtotal',
        'jumlah_bayar',
        'kembalian',
        'tanggal'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function kasir()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function faktur()
    {
        return $this->hasOne(Faktur::class, 'id_transaksi', 'id_transaksi');
    }

    public function details()
    {
        return $this->hasMany(TransaksiDetail::class, 'id_transaksi', 'id_transaksi');
    }
}
