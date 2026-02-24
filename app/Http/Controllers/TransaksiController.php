<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProdukResource;
use App\Http\Resources\TransaksiResource;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Services\TransaksiService;
use App\Http\Requests\Transaksi\RiwayatTransaksiRequest;
use App\Http\Requests\Transaksi\StoreTransaksiRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    use ApiResponse;

    protected $transaksiService;

    public function __construct(TransaksiService $transaksiService)
    {
        $this->transaksiService = $transaksiService;
    }

    public function index(Request $request)
    {
        $products = Produk::where('is_active', true)->get();

        if ($request->wantsJson()) {
            return $this->successResponse(
                ProdukResource::collection($products),
                'List produk aktif berhasil diambil'
            );
        }

        return Inertia::render('Transaksi/Index', [
            'products' => $products
        ]);
    }

    public function qris(Request $request)
    {
        return Inertia::render('Transaksi/Qris', [
            'cart' => $request->query('cart'),
            'total' => $request->query('total')
        ]);
    }

    public function history(RiwayatTransaksiRequest $request)
    {
        // Force fetch all for client-side filtering
        $filters = $request->validated();
        $filters['per_page'] = $filters['per_page'] ?? -1;

        $historyData = $this->transaksiService->getHistory($filters);

        if ($request->wantsJson()) {
            return $this->successResponse([
                'transactions' => TransaksiResource::collection($historyData['data']),
                'total_transactions' => $historyData['total_transactions'],
                'total_revenue' => $historyData['total_revenue'],
                'filters' => $request->only(['search', 'per_page', 'filter_type', 'start_date', 'end_date']),
            ], 'Riwayat transaksi berhasil diambil');
        }

        return Inertia::render('Riwayat/Index', [
            'transactions' => $historyData,
            'filters' => $request->only(['search', 'per_page', 'filter_type', 'start_date', 'end_date']),
        ]);
    }

    public function show(Request $request, Transaksi $transaksi)
    {
        $transaction = $transaksi->load(['kasir', 'details.produk', 'faktur']);

        if ($request->wantsJson()) {
            return $this->successResponse(new TransaksiResource($transaction), 'Detail transaksi berhasil diambil');
        }

        return Inertia::render('Riwayat/Show', [
            'transaction' => $transaction
        ]);
    }

    public function store(StoreTransaksiRequest $request)
    {
        try {
            $data = $request->validated();
            $data['id_user'] = auth()->id();

            $result = $this->transaksiService->create($data);

            if ($request->wantsJson()) {
                return $this->successResponse($result, 'Transaksi berhasil disimpan', 201);
            }

            $result['items'] = $data['items'];
            $result['metode_bayar'] = $data['metode_bayar'];

            return redirect()->route('transaksi.index')->with([
                'receipt' => $result
            ]);
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menyimpan transaksi: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
