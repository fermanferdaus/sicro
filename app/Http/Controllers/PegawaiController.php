<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pegawai\StorePegawaiRequest;
use App\Http\Requests\Pegawai\UpdatePegawaiRequest;
use App\Http\Resources\PegawaiResource;
use App\Models\Pegawai;
use App\Services\PegawaiService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    use ApiResponse;

    protected $pegawaiService;

    public function __construct(PegawaiService $pegawaiService)
    {
        $this->pegawaiService = $pegawaiService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $pegawai = $this->pegawaiService->getAll($search);

        if ($request->wantsJson()) {
            return $this->successResponse(
                PegawaiResource::collection($pegawai),
                'List data pegawai berhasil diambil'
            );
        }

        return Inertia::render('Pegawai/Index', [
            'pegawai' => $pegawai,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Pegawai/Create');
    }

    public function store(StorePegawaiRequest $request)
    {
        try {
            $pegawai = $this->pegawaiService->create($request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new PegawaiResource($pegawai),
                    'Pegawai berhasil ditambahkan',
                    201
                );
            }

            return redirect()->route('pegawai.index')->with('success', 'Pegawai berhasil ditambahkan');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menambahkan pegawai: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function edit(Pegawai $pegawai)
    {
        return Inertia::render('Pegawai/Edit', [
            'pegawai' => $pegawai->load('user')
        ]);
    }

    public function update(UpdatePegawaiRequest $request, Pegawai $pegawai)
    {
        try {
            $updatedPegawai = $this->pegawaiService->update($pegawai, $request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new PegawaiResource($updatedPegawai),
                    'Pegawai berhasil diperbarui'
                );
            }

            return redirect()->route('pegawai.index')->with('success', 'Pegawai berhasil diperbarui');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal memperbarui pegawai: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function destroy(Request $request, Pegawai $pegawai)
    {
        try {
            $this->pegawaiService->delete($pegawai);

            if ($request->wantsJson()) {
                return $this->successResponse(null, 'Pegawai berhasil dihapus');
            }

            return redirect()->route('pegawai.index')->with('success', 'Pegawai berhasil dihapus');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menghapus pegawai: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
