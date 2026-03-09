<?php

namespace App\Services;

use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;

class AuthService
{
    public function authenticateUser(string $username, string $password): ?User
    {
        $user = User::where('username', $username)->first();

        if (!$user || $user->username !== $username) {
            throw ValidationException::withMessages([
                Fortify::username() => ['Username tidak ditemukan.'],
            ]);
        }

        if (!Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password salah.'],
            ]);
        }

        return $user;
    }

    public function login(array $credentials)
    {
        if (!$token = JWTAuth::attempt($credentials)) {
            return null;
        }

        $user = auth()->user();
        if ($user && $user->username !== $credentials['username']) {
            JWTAuth::invalidate($token);
            return null;
        }

        return $this->formatTokenResponse($token);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
    }

    protected function formatTokenResponse($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => auth()->user()
        ];
    }
}
