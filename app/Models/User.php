<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Primary Key Settings (UUID)
     */
    protected $primaryKey = 'id_user';
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Mass Assignable
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'nama_lengkap',
        'foto_profile',
    ];

    /**
     * Hidden Fields
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * Casts
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    /**
     * Auto Generate UUID Saat Create
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->id_user) {
                $model->id_user = Str::uuid()->toString();
            }
        });
    }

    /**
     * RELATIONS
     */

    // Biodata pegawai
    public function pegawai()
    {
        return $this->hasOne(Pegawai::class, 'id_user', 'id_user');
    }

    // Transaksi sebagai kasir
    public function transaksis()
    {
        return $this->hasMany(Transaksi::class, 'id_user', 'id_user');
    }

    // Pengeluaran yang dibuat
    public function pengeluarans()
    {
        return $this->hasMany(Pengeluaran::class, 'created_by', 'id_user');
    }

    // Gaji pegawai
    public function gajis()
    {
        return $this->hasMany(Gaji::class, 'id_pegawai', 'id_user');
    }

    // Bonus pegawai
    public function bonus()
    {
        return $this->hasMany(Bonus::class, 'id_pegawai', 'id_user');
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
        ];
    }
}
