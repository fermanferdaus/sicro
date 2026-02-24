<?php

namespace App\Http\Requests\Transaksi;

use Illuminate\Foundation\Http\FormRequest;

class RiwayatTransaksiRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string',
            'per_page' => 'nullable|integer|min:1',
            'filter_type' => 'nullable|in:daily,monthly,period',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];
    }

    public function messages()
    {
        return [
            'search.string' => 'Pencarian harus berupa teks.',
            'per_page.integer' => 'Jumlah per halaman harus berupa angka.',
            'per_page.min' => 'Jumlah per halaman minimal 1.',
            'filter_type.in' => 'Tipe filter harus daily, monthly, atau period.',
            'start_date.date' => 'Tanggal mulai tidak valid.',
            'end_date.date' => 'Tanggal akhir tidak valid.',
        ];
    }
}
