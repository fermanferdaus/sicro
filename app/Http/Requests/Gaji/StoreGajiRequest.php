<?php

namespace App\Http\Requests\Gaji;

use Illuminate\Foundation\Http\FormRequest;

class StoreGajiRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_pegawai' => 'required|exists:pegawais,id_pegawai|unique:gajis,id_pegawai',
            'gaji_pokok' => 'required|numeric|min:0',
            'tipe_gaji' => 'required|in:harian,mingguan,bulanan',
        ];
    }

    public function messages()
    {
        return [
            'id_pegawai.required' => 'Pegawai wajib dipilih.',
            'id_pegawai.exists' => 'Pegawai tidak ditemukan.',
            'id_pegawai.unique' => 'Pegawai ini sudah memiliki pengaturan gaji.',
            'gaji_pokok.required' => 'Gaji pokok wajib diisi.',
            'gaji_pokok.numeric' => 'Gaji pokok harus berupa angka.',
            'tipe_gaji.required' => 'Tipe gaji wajib dipilih.',
            'tipe_gaji.in' => 'Tipe gaji harus harian, mingguan, atau bulanan.',
        ];
    }
}
