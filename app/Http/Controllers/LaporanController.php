<?php

namespace App\Http\Controllers;

use App\Http\Requests\Laporan\GetPenjualanRequest;
use App\Services\LaporanService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanController extends Controller
{
    protected $laporanService;

    public function __construct(LaporanService $laporanService)
    {
        $this->laporanService = $laporanService;
    }

    public function index()
    {
        return Inertia::render('Laporan/Index');
    }

    public function penjualan(GetPenjualanRequest $request)
    {
        $filters = $request->validated();
        $data = $this->laporanService->getPenjualan($filters);

        return Inertia::render('Laporan/Penjualan', [
            'transactions' => $data['transactions'],
            'filters' => [
                'start_date' => $filters['start_date'] ?? Carbon::now()->startOfMonth()->toDateString(),
                'end_date' => $filters['end_date'] ?? Carbon::now()->endOfMonth()->toDateString(),
            ],
            'summary' => $data['summary']
        ]);
    }

    public function produk(Request $request)
    {
        $category = $request->input('category');
        $products = $this->laporanService->getProduk($category);
        $categories = $this->laporanService->getCategories();

        return Inertia::render('Laporan/Produk', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $category,
            ]
        ]);
    }

    public function labaRugi(Request $request)
    {
        $filters = [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ];

        $data = $this->laporanService->getLabaRugi($filters);

        return Inertia::render('Laporan/LabaRugi', $data);
    }
}
