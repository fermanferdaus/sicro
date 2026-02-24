<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use App\Services\PegawaiService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    use ApiResponse;

    protected $userService;
    protected $pegawaiService;

    public function __construct(UserService $userService, PegawaiService $pegawaiService)
    {
        $this->userService = $userService;
        $this->pegawaiService = $pegawaiService;
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $accounts = $this->userService->getAll($search);

        if ($request->wantsJson()) {
            return $this->successResponse(
                UserResource::collection($accounts),
                'List data akun berhasil diambil'
            );
        }

        return Inertia::render('Account/Index', [
            'accounts' => $accounts,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function create()
    {
        $pegawai = $this->pegawaiService->getAll();
        return Inertia::render('Account/Create', [
            'pegawai' => $pegawai
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        try {
            $user = $this->userService->create($request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new UserResource($user),
                    'Akun berhasil ditambahkan',
                    201
                );
            }

            return redirect()->route('account.index')->with('success', 'Akun berhasil ditambahkan');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menambahkan akun: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function edit(User $user)
    {
        $pegawai = $this->pegawaiService->getAll();

        return Inertia::render('Account/Edit', [
            'account' => $user->load('pegawai'),
            'pegawai' => $pegawai
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $updatedUser = $this->userService->update($user, $request->validated());

            if ($request->wantsJson()) {
                return $this->successResponse(
                    new UserResource($updatedUser),
                    'Akun berhasil diperbarui'
                );
            }

            return redirect()->route('account.index')->with('success', 'Akun berhasil diperbarui');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal memperbarui akun: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function destroy(Request $request, User $user)
    {
        try {
            $this->userService->delete($user);

            if ($request->wantsJson()) {
                return $this->successResponse(null, 'Akun berhasil dihapus');
            }

            return redirect()->route('account.index')->with('success', 'Akun berhasil dihapus');
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return $this->errorResponse('Gagal menghapus akun: ' . $e->getMessage());
            }
            return redirect()->back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
