<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\PterodactylApiException;
use App\Services\PterodactylService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BotServerController extends Controller
{
    public function store(Request $request, PterodactylService $pterodactylService): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'language' => ['required', 'string', 'in:nodejs,python'],
            'ram_mb' => ['required', 'integer', 'in:512,1024,2048'],
        ]);

        /** @var User $user */
        $user = $request->user();

        try {
            $pterodactylServerId = $pterodactylService->createServer(
                $validated['name'],
                $validated['language'],
                (int) $validated['ram_mb'],
            );
        } catch (PterodactylApiException) {
            return back()->withErrors([
                'name' => 'Le serveur n’a pas pu être créé. Vérifiez la configuration Pterodactyl et réessayez.',
            ]);
        }

        $user->botServers()->create([
            ...$validated,
            'pterodactyl_server_id' => $pterodactylServerId,
            'ram_mb' => (int) $validated['ram_mb'],
            'cost_per_hour' => config('bot_servers.hourly_costs.'.(int) $validated['ram_mb']),
            'status' => 'active',
        ]);

        return back()->with('success', 'Votre bot a été créé.');
    }
}
