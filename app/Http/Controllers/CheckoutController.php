<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function buyCoins(Request $request): Response
    {
        $secret = (string) config('services.stripe.secret');

        if ($secret === '') {
            return back()->withErrors([
                'checkout' => 'Le paiement est temporairement indisponible.',
            ]);
        }

        try {
            Stripe::setApiKey($secret);

            $checkoutSession = Session::create([
                'mode' => 'payment',
                'client_reference_id' => (string) $request->user()->getKey(),
                'line_items' => [[
                    'quantity' => 1,
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => 500,
                        'product_data' => [
                            'name' => '1000 pièces',
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
