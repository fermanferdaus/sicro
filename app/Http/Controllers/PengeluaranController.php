<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pengeluaran\StorePengeluaranRequest;
use App\Http\Requests\Pengeluaran\UpdatePengeluaranRequest;
use App\Http\Resources\PengeluaranResource;
use App\Models\Pengeluaran;
use App\Services\PengeluaranService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengeluaranController extends Controller
{
    use ApiResponse;

    protected $pengeluaranService;

    public function __construct(PengeluaranService $pengeluaranService)
    {
        $this->pengeluaranService = $pengeluaranService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['kategori', 'filter_type', 'start_date', 'end_date']);
        $pengeluaran = $this->pengeluaranService->getAll($filters);

        // Get unique categories for filter
        $categories = Pengeluaran::distinct()->pluck('kategori');

        if ($request->wantsJson()) {
            return $this->successResponse([
                'pengeluaran' => PengeluaranResource::collection($pengeluaran),
                'categories' => $categories,
                'filters' => $filters
            ], 'List data pengeluaran berhasil diambil');
        }

        return Inertia::render('Pengeluaran/Index', [
            'pengeluaran' => $pengeluaran,
            'categories' => $categories,
            'filters' => $filters
        ]);
    }

    public function create()
    {
        return Inertia::render('Pengeluaran/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengeluaranRequest $request)
    {
        $pengeluaran = $this->pengeluaranService->create($request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new PengeluaranResource($pengeluaran),
                'Pengeluaran berhasil ditambahkan',
                201
            );
        }

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengeluaran $pengeluaran)
    {
        return $this->successResponse(new PengeluaranResource($pengeluaran->load('creator')));
    }

    public function edit(Pengeluaran $pengeluaran)
    {
        return Inertia::render('Pengeluaran/Edit', [
            'pengeluaran' => $pengeluaran
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePengeluaranRequest $request, Pengeluaran $pengeluaran)
    {
        $updatedPengeluaran = $this->pengeluaranService->update($pengeluaran, $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new PengeluaranResource($updatedPengeluaran),
                'Pengeluaran berhasil diperbarui'
            );
        }

        return redirect()->route('pengeluaran.index')->with('success', 'Pengeluaran berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Pengeluaran $pengeluaran)
    {
        $this->pengeluaranService->delete($pengeluaran);

        if ($request->wantsJson()) {
            return $this->successResponse(null, 'Pengeluaran berhasil dihapus');
        }

        return redirect()->back()->with('success', 'Pengeluaran berhasil dihapus');
    }
}
