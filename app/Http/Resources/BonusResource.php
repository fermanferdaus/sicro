<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BonusResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_bonus' => $this->id_bonus,
            'id_pegawai' => $this->id_pegawai,
            'judul' => $this->judul,
            'nominal' => $this->nominal,
            'periode' => $this->periode,
            'keterangan' => $this->keterangan,
            'status' => $this->status,
            'pegawai' => $this->whenLoaded('pegawai'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
