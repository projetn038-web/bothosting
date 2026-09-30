<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BotServerController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'language' => ['required', 'string', 'in:nodejs,python'],
            'ram_mb' => ['required', 'integer', 'in:512,1024,2048'],
        ]);

        $hourlyCosts = [
            512 => 5,
            1024 => 10,
            2048 => 20,
        ];

        /** @var User $user */
        $user = $request->user();
        $user->botServers()->create([
            ...$validated,
            'ram_mb' => (int) $validated['ram_mb'],
            'cost_per_hour' => $hourlyCosts[(int) $validated['ram_mb']],
            'status' => 'active',
        ]);

        return back()->with('success', 'Votre bot a été créé.');
    }
}
