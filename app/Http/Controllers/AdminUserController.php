<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminUserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::query()
                ->withCount('botServers')
                ->latest()
                ->get([
                    'id',
                    'name',
                    'email',
                    'coins',
                    'last_login_ip',
                    'last_login_at',
                    'is_banned',
                ]),
        ]);
    }

    public function toggleBan(User $user): RedirectResponse
    {
        $user->forceFill(['is_banned' => ! $user->is_banned])->save();

        return back()->with(
            'success',
            $user->is_banned
                ? 'Le compte a été suspendu.'
                : 'Le compte a été réactivé.',
        );
    }

    public function updateCoins(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:-2147483647', 'max:2147483647', 'not_in:0'],
        ]);

        $updatedUser = DB::transaction(function () use ($user, $validated): ?User {
            $lockedUser = User::query()->lockForUpdate()->findOrFail($user->getKey());
            $updatedCoins = $lockedUser->coins + $validated['amount'];

            if ($updatedCoins < 0 || $updatedCoins > 2147483647) {
                return null;
            }

            $lockedUser->forceFill(['coins' => $updatedCoins])->save();

            return $lockedUser;
        });

        if ($updatedUser === null) {
            return back()->withErrors([
                'amount' => 'Cette modification dépasserait le solde autorisé.',
            ]);
        }

        return back()->with('success', 'Le solde de pièces a été mis à jour.');
    }
}
