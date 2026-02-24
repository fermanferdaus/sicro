<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('username', 'password');
        $data = $this->authService->login($credentials);

        return response()->json($data);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        $this->authService->logout();

        return response()->json([
            'message' => 'Berhasil logout'
        ]);
    }
}
