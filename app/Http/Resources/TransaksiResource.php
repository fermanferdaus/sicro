<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransaksiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_transaksi' => $this->id_transaksi,
            'id_user' => $this->id_user,
            'nama_kasir' => $this->nama_kasir,
            'kategori' => $this->kategori,
            'metode_bayar' => $this->metode_bayar,
            'subtotal' => $this->subtotal,
            'jumlah_bayar' => $this->jumlah_bayar,
            'kembalian' => $this->kembalian,
            'tanggal' => $this->tanggal,
            'kasir' => $this->whenLoaded('kasir'),
            'details' => TransaksiDetailResource::collection($this->whenLoaded('details')),
            'faktur' => $this->whenLoaded('faktur'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
