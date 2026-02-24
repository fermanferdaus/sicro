<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\UserService;
use App\Http\Requests\Setting\UpdateSettingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        return Inertia::render('Setting/Index');
    }

    public function update(UpdateSettingRequest $request)
    {
        $user = auth()->user();
        $this->userService->updateProfile($user, $request->validated());

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
