<?php

namespace App\Http\Controllers;

use App\Http\Requests\Produk\StoreProdukRequest;
use App\Http\Requests\Produk\UpdateProdukRequest;
use App\Http\Resources\ProdukResource;
use App\Models\Produk;
use App\Services\ProdukService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class ProdukController extends Controller
{
    use ApiResponse;

    protected $produkService;

    public function __construct(ProdukService $produkService)
    {
        $this->produkService = $produkService;
    }

    // GET ALL
    public function index(Request $request)
    {
        $search = $request->input('search');
        $produk = $this->produkService->getAll($search);

        if ($request->wantsJson()) {
            return $this->successResponse(
                ProdukResource::collection($produk),
                'List data produk berhasil diambil'
            );
        }

        return Inertia::render('Produk/Index', [
            'produk' => $produk,
            'total_produk' => count($produk),
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    // CREATE PAGE
    public function create()
    {
        return Inertia::render('Produk/Create');
    }

    // STORE
    public function store(StoreProdukRequest $request)
    {
        try {
            $produk = $this->produkService->create($request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new ProdukResource($produk),
                    'Produk berhasil ditambahkan',
                    201
                );
            }

            return Redirect::route('produk.index')->with('success', 'Produk berhasil dibuat');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal membuat produk: ' . $e->getMessage());
            }
            return Redirect::back()->with('error', 'Gagal membuat produk: ' . $e->getMessage());
        }
    }

    // EDIT PAGE
    public function edit(Produk $produk)
    {
        return Inertia::render('Produk/Edit', [
            'produk' => $produk
        ]);
    }

    // UPDATE
    public function update(UpdateProdukRequest $request, Produk $produk)
    {
        try {
            $updatedProduk = $this->produkService->update($produk, $request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new ProdukResource($updatedProduk),
                    'Produk berhasil diperbarui'
                );
            }

            return Redirect::route('produk.index')->with('success', 'Produk berhasil diperbarui');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal memperbarui produk: ' . $e->getMessage());
            }
            return Redirect::back()->with('error', 'Gagal memperbarui produk: ' . $e->getMessage());
        }
    }

    // DELETE
    public function destroy(Request $request, Produk $produk)
    {
        try {
            $this->produkService->delete($produk);

            if ($request->wantsJson()) {
                return $this->successResponse(null, 'Produk berhasil dihapus');
            }

            return Redirect::back()->with('success', 'Produk berhasil dihapus');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menghapus produk: ' . $e->getMessage());
            }
            return Redirect::back()->with('error', 'Gagal menghapus produk: ' . $e->getMessage());
        }
    }
}