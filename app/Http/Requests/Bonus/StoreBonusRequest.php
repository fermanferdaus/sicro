<?php

namespace App\Http\Requests\Bonus;

use Illuminate\Foundation\Http\FormRequest;

class StoreBonusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_pegawai' => 'required|exists:pegawais,id_pegawai',
            'judul' => 'required|string',
            'jumlah' => 'required|numeric',
            'keterangan' => 'required|string',
            'periode' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'id_pegawai.required' => 'Pegawai wajib dipilih.',
            'id_pegawai.exists' => 'Pegawai tidak ditemukan.',
            'judul.required' => 'Judul bonus wajib diisi.',
            'judul.string' => 'Judul bonus harus berupa teks.',
            'jumlah.required' => 'Jumlah bonus wajib diisi.',
            'jumlah.numeric' => 'Jumlah bonus harus berupa angka.',
            'keterangan.required' => 'Keterangan wajib diisi.',
            'keterangan.string' => 'Keterangan harus berupa teks.',
            'periode.required' => 'Periode wajib diisi.',
            'periode.string' => 'Periode harus berupa teks.',
        ];
    }
}
