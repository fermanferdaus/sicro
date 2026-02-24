<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Gaji\StoreGajiRequest;
use App\Http\Requests\Gaji\UpdateGajiRequest;
use App\Http\Resources\GajiResource;
use App\Models\Gaji;
use App\Services\GajiService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GajiController extends Controller
{
    use ApiResponse;

    protected $gajiService;

    public function __construct(GajiService $gajiService)
    {
        $this->gajiService = $gajiService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $gaji = $this->gajiService->getAll($search);

        if ($request->wantsJson()) {
            return $this->successResponse(
                GajiResource::collection($gaji),
                'List data gaji berhasil diambil'
            );
        }

        return Inertia::render('Gaji/Index', [
            'gaji' => $gaji,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Gaji/Create', [
            'pegawai' => $this->gajiService->getPegawai()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGajiRequest $request)
    {
        $gaji = $this->gajiService->create($request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new GajiResource($gaji),
                'Pengaturan gaji berhasil disimpan',
                201
            );
        }

        return redirect()->route('gaji.index')->with('success', 'Pengaturan gaji berhasil disimpan');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gaji $gaji)
    {
        return Inertia::render('Gaji/Edit', [
            'gaji' => $gaji->load('pegawai'),
            'pegawai' => $this->gajiService->getPegawai()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGajiRequest $request, Gaji $gaji)
    {
        $updatedGaji = $this->gajiService->update($gaji, $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new GajiResource($updatedGaji),
                'Pengaturan gaji berhasil diperbarui'
            );
        }

        return redirect()->route('gaji.index')->with('success', 'Pengaturan gaji berhasil diperbarui');
    }

    public function destroy(Request $request, Gaji $gaji)
    {
        $this->gajiService->delete($gaji);

        if ($request->wantsJson()) {
            return $this->successResponse(null, 'Pengaturan gaji berhasil dihapus');
        }

        return redirect()->route('gaji.index')->with('success', 'Pengaturan gaji berhasil dihapus');
    }
}
