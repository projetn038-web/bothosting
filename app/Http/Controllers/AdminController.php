<?php

namespace App\Http\Controllers;

use App\Models\BotServer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        if (array_diff($request->keys(), ['password']) !== []) {
            return back()->withErrors([
                'password' => 'Seul le champ mot de passe est accepté.',
            ]);
        }

        $validated = $request->validate([
            'password' => ['required', 'string'],
        ]);

        $adminPassword = config('admin.password');

        if (! is_string($adminPassword)
            || $adminPassword === ''
            || ! hash_equals($adminPassword, $validated['password'])) {
            return back()->withErrors([
                'password' => 'Le mot de passe administrateur est incorrect.',
            ]);
        }

        $request->session()->regenerate();
        $request->session()->put('is_admin', true);

        return redirect()->route('admin.dashboard');
    }

    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'bots' => BotServer::count(),
                'coins' => User::sum('coins'),
            ],
            'servers' => BotServer::with('user')->latest()->get(),
        ]);
    }
}
