<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GajiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_gaji' => $this->id_gaji,
            'id_pegawai' => $this->id_pegawai,
            'gaji_pokok' => $this->gaji_pokok,
            'tipe_gaji' => $this->tipe_gaji,
            'pegawai' => $this->whenLoaded('pegawai'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
