<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransaksiDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_detail' => $this->id_detail,
            'id_transaksi' => $this->id_transaksi,
            'id_produk' => $this->id_produk,
            'harga_satuan' => $this->harga_satuan,
            'qty' => $this->qty,
            'total' => $this->total,
            'produk' => new ProdukResource($this->whenLoaded('produk')),
        ];
    }
}
