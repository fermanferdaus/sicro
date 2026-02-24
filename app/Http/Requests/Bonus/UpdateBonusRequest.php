<?php

namespace App\Http\Requests\Bonus;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBonusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'judul' => 'sometimes|string',
            'jumlah' => 'sometimes|numeric',
            'keterangan' => 'sometimes|string',
            'periode' => 'sometimes|string',
        ];
    }

    public function messages()
    {
        return [
            'judul.string' => 'Judul bonus harus berupa teks.',
            'jumlah.numeric' => 'Jumlah bonus harus berupa angka.',
            'keterangan.string' => 'Keterangan harus berupa teks.',
            'periode.string' => 'Periode harus berupa teks.',
        ];
    }
}
