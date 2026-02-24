<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PegawaiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_pegawai' => $this->id_pegawai,
            'id_user' => $this->id_user,
            'kode_pegawai' => $this->kode_pegawai,
            'nama_lengkap' => $this->nama_lengkap,
            'email' => $this->email,
            'alamat' => $this->alamat,
            'nomor_telepon' => $this->nomor_telepon,
            'tanggal_lahir' => $this->tanggal_lahir,
            'jenis_kelamin' => $this->jenis_kelamin,
            'user' => $this->whenLoaded('user'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
