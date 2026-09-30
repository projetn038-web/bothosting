<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CoinController extends Controller
{
    public function claimDaily(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $now = now();

        $claimed = User::query()
            ->whereKey($user->getKey())
            ->where(function (Builder $query) use ($now): void {
                $query->whereNull('last_daily_claim')
                    ->orWhere('last_daily_claim', '<=', $now->copy()->subDay());
            })
            ->increment('coins', 50, ['last_daily_claim' => $now]);

        if ($claimed === 0) {
            $claimAvailableAt = $user->fresh()->last_daily_claim->addDay();
            $minutesRemaining = max(
                1,
                (int) ceil(($claimAvailableAt->getTimestamp() - $now->getTimestamp()) / 60),
            );
            $hoursRemaining = intdiv($minutesRemaining, 60);
            $remainingMinutes = $minutesRemaining % 60;
            $timeRemaining = $hoursRemaining > 0
                ? "{$hoursRemaining} h".($remainingMinutes > 0 ? " et {$remainingMinutes} min" : '')
                : "{$minutesRemaining} min";

            return back()->withErrors([
                'claim' => "Votre prochaine récompense sera disponible dans {$timeRemaining}.",
            ]);
        }

        return back()->with('success', 'Votre récompense quotidienne de 50 pièces a été ajoutée.');
    }
}
