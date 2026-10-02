<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function buyCoins(Request $request): Response
    {
        $coinPackages = config('coin_packages.packages');
        $validated = $request->validate([
            'coins_amount' => ['required', 'integer', Rule::in(array_map('intval', array_keys($coinPackages)))],
            'currency' => ['required', 'in:eur,xof'],
            'payment_method' => ['required', 'in:stripe,mobile_money'],
        ]);

        $coinsAmount = (int) $validated['coins_amount'];
        $currency = $validated['currency'];
        $unitAmount = $coinPackages[$coinsAmount]['prices'][$currency];
        $secret = (string) config('services.stripe.secret');

        if ($secret === '' && app()->environment('local')) {
            $request->user()->increment('coins', $coinsAmount);

            return back()->with(
                'success',
                "[DEV MODE] {$coinsAmount} pièces ajoutées (Clés Stripe manquantes).",
            );
        }

        switch ($validated['payment_method']) {
            case 'mobile_money':
                return back()->with('success', 'Paiement Mobile Money en cours d’intégration.');
            case 'stripe':
                if ($secret === '') {
                    return back()->withErrors([
                        'checkout' => 'Le paiement est temporairement indisponible.',
                    ]);
                }

                break;
        }

        try {
            Stripe::setApiKey($secret);

            $checkoutSession = Session::create([
                'mode' => 'payment',
                'client_reference_id' => (string) $request->user()->getKey(),
                'metadata' => [
                    'coins_amount' => (string) $coinsAmount,
                ],
                'line_items' => [[
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => $currency,
                        'unit_amount' => $unitAmount,
                        'product_data' => [
                            'name' => "{$coinPackages[$coinsAmount]['name']} - {$coinsAmount} pièces",
                        ],
                    ],
                ]],
                'success_url' => route('dashboard').'?checkout=success',
                'cancel_url' => route('dashboard').'?checkout=cancelled',
            ]);
        } catch (ApiErrorException $exception) {
            Log::error('Stripe Checkout session creation failed.', [
                'user_id' => $request->user()->getKey(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return back()->withErrors([
                'checkout' => 'Impossible de démarrer le paiement. Veuillez réessayer.',
            ]);
        }

        if (! is_string($checkoutSession->url) || $checkoutSession->url === '') {
            Log::error('Stripe Checkout session was created without a redirect URL.', [
                'user_id' => $request->user()->getKey(),
                'session_id' => $checkoutSession->id,
            ]);

            return back()->withErrors([
                'checkout' => 'Impossible de démarrer le paiement. Veuillez réessayer.',
            ]);
        }

        return Inertia::location($checkoutSession->url);
    }
}
