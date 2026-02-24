<?php

namespace App\Http\Controllers;

use App\Http\Requests\Bonus\StoreBonusRequest;
use App\Http\Requests\Bonus\UpdateBonusRequest;
use App\Http\Resources\BonusResource;
use App\Models\Bonus;
use App\Services\BonusService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BonusController extends Controller
{
    use ApiResponse;

    protected $bonusService;

    public function __construct(BonusService $bonusService)
    {
        $this->bonusService = $bonusService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $month = $request->input('month', date('n'));
        $year = $request->input('year', date('Y'));

        $bonus = $this->bonusService->getAll($search, $month, $year);

        if ($request->wantsJson()) {
            return $this->successResponse(
                BonusResource::collection($bonus),
                'List data bonus berhasil diambil'
            );
        }

        return Inertia::render('Bonus/Index', [
            'bonus' => $bonus,
            'filters' => [
                'search' => $search,
                'month' => $month,
                'year' => $year
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Bonus/Create', [
            'pegawai' => $this->bonusService->getPegawai()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBonusRequest $request)
    {
        $bonus = $this->bonusService->create($request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new BonusResource($bonus),
                'Bonus berhasil ditambahkan',
                201
            );
        }

        return redirect()->route('bonus.index')->with('success', 'Bonus berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bonus $bonus)
    {
        return Inertia::render('Bonus/Edit', [
            'bonus' => $bonus->load('pegawai'),
            'pegawai' => $this->bonusService->getPegawai()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBonusRequest $request, Bonus $bonus)
    {
        $updatedBonus = $this->bonusService->update($bonus, $request->validated());

        if ($request->wantsJson()) {
            return $this->successResponse(
                new BonusResource($updatedBonus),
                'Bonus berhasil diperbarui'
            );
        }

        return redirect()->route('bonus.index')->with('success', 'Bonus berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Bonus $bonus)
    {
        $this->bonusService->delete($bonus);

        if ($request->wantsJson()) {
            return $this->successResponse(null, 'Bonus berhasil dihapus');
        }

        return redirect()->route('bonus.index')->with('success', 'Bonus berhasil dihapus');
    }

    /**
     * Update status bonus.
     */
    public function updateStatus(Request $request, Bonus $bonus)
    {
        $status = $request->input('status');
        $this->bonusService->updateStatus($bonus, $status);

        if ($request->wantsJson()) {
            return $this->successResponse(
                new BonusResource($bonus),
                'Status bonus berhasil diperbarui'
            );
        }

        return redirect()->back()->with('success', 'Status bonus berhasil diperbarui');
    }
}