<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\InternalServerErrorHttpException;
use UnexpectedValueException;

class WebhookController extends Controller
{
    private const COINS_PER_PURCHASE = 1000;

    private const PURCHASE_AMOUNT_CENTS = 500;

    public function handleStripe(Request $request): Response
    {
        $webhookSecret = (string) config('services.stripe.webhook_secret');
        $signature = $request->header('Stripe-Signature');

        if ($webhookSecret === '') {
            Log::error('Stripe webhook secret is not configured.');

            throw new InternalServerErrorHttpException('Stripe webhook secret is not configured.');
        }

        if (! is_string($signature) || $signature === '') {
            throw new BadRequestHttpException('Invalid Stripe webhook signature.');
        }

        try {
            $event = Webhook::constructEvent($request->getContent(), $signature, $webhookSecret);
        } catch (UnexpectedValueException|SignatureVerificationException $exception) {
            Log::warning('Rejected Stripe webhook with an invalid signature or payload.', [
                'exception' => $exception::class,
            ]);

            throw new BadRequestHttpException('Invalid Stripe webhook signature.', $exception);
        }

        if (! in_array($event->type, [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded',
        ], true)) {
            return response()->noContent();
        }

        $checkoutSession = $event->data->object;
        $userId = filter_var($checkoutSession->client_reference_id ?? null, FILTER_VALIDATE_INT);

        if (
            $userId === false
            || $userId < 1
            || ($checkoutSession->mode ?? null) !== 'payment'
            || ($checkoutSession->payment_status ?? null) !== 'paid'
            || strtolower((string) ($checkoutSession->currency ?? '')) !== 'eur'
            || (int) ($checkoutSession->amount_total ?? 0) !== self::PURCHASE_AMOUNT_CENTS
            || ! is_string($checkoutSession->id ?? null)
            || ! is_string($event->id ?? null)
        ) {
            Log::warning('Ignored Stripe Checkout event that does not match the coin purchase.', [
                'event_id' => $event->id ?? null,
                'session_id' => $checkoutSession->id ?? null,
                'client_reference_id' => $checkoutSession->client_reference_id ?? null,
                'mode' => $checkoutSession->mode ?? null,
                'payment_status' => $checkoutSession->payment_status ?? null,
                'currency' => $checkoutSession->currency ?? null,
                'amount_total' => $checkoutSession->amount_total ?? null,
            ]);

            return response()->noContent();
        }

        $user = User::query()->find($userId);

        if ($user === null) {
            Log::warning('Ignored paid Stripe Checkout session for a missing user.', [
                'event_id' => $event->id,
                'user_id' => $userId,
            ]);

            return response()->noContent();
        }

        DB::transaction(function () use ($user, $checkoutSession, $event): void {
            $inserted = DB::table('stripe_checkout_payments')->insertOrIgnore([
                'user_id' => $user->getKey(),
                'stripe_checkout_session_id' => $checkoutSession->id,
                'stripe_event_id' => $event->id,
                'coins' => self::COINS_PER_PURCHASE,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($inserted === 1) {
                User::query()
                    ->whereKey($user->getKey())
                    ->increment('coins', self::COINS_PER_PURCHASE);
            }
        });

        return response()->noContent();
    }
}
