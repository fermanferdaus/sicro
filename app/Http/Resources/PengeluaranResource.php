<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PengeluaranResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_pengeluaran' => $this->id_pengeluaran,
            'kategori' => $this->kategori,
            'judul' => $this->judul,
            'deskripsi' => $this->deskripsi,
            'jumlah' => $this->jumlah,
            'bukti_path' => $this->bukti_path ? asset('storage/' . $this->bukti_path) : null,
            'tanggal' => $this->tanggal,
            'created_by' => $this->created_by,
            'creator' => $this->whenLoaded('creator'),
            'profil' => $this->whenLoaded('profil'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
