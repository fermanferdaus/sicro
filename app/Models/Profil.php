<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Profil extends Model
{
    use HasFactory;

    protected $table = 'profils';
    protected $primaryKey = 'id_profil';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_profil',
        'nama_store',
        'alamat',
        'nama_owner',
        'logo',
        'telepon',
        'instagram',
        'tiktok',
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

    public function pengeluarans()
    {
        return $this->hasMany(Pengeluaran::class, 'id_profil', 'id_profil');
    }
}
