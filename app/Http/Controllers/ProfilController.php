<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profil\UpdateProfilRequest;
use App\Services\ProfilService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfilController extends Controller
{
    protected $profilService;

    public function __construct(ProfilService $profilService)
    {
        $this->profilService = $profilService;
    }

    public function index()
    {
        $profil = $this->profilService->getProfil();

        return Inertia::render('Profil/Index', [
            'profil_data' => $profil
        ]);
    }

    public function update(UpdateProfilRequest $request)
    {
        $this->profilService->updateProfil($request->validated());

        return back()->with('success', 'Profil toko berhasil diperbarui.');
    }
}
