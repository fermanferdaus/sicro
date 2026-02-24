<?php

namespace App\Http\Requests\Gaji;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGajiRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'gaji_pokok' => 'required|numeric|min:0',
            'tipe_gaji' => 'required|in:harian,mingguan,bulanan',
        ];
    }

    public function messages()
    {
        return [
            'periode.string' => 'Periode harus berupa teks.',
            'gaji_pokok.numeric' => 'Gaji pokok harus berupa angka.',
            'total_bonus.numeric' => 'Total bonus harus berupa angka.',
            'status.in' => 'Status harus draft atau dibayar.',
            'tanggal_bayar.date' => 'Tanggal bayar tidak valid.',
        ];
    }
}
