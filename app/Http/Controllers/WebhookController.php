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
        $coinsAmount = filter_var(
            $checkoutSession->metadata->coins_amount ?? null,
            FILTER_VALIDATE_INT,
        );
        $currency = strtolower((string) ($checkoutSession->currency ?? ''));
        $coinPackages = config('coin_packages.packages');
        $expectedAmount = is_int($coinsAmount) && isset($coinPackages[$coinsAmount])
            ? ($coinPackages[$coinsAmount]['prices'][$currency] ?? null)
            : null;

        if (
            $userId === false
            || $userId < 1
            || ($checkoutSession->mode ?? null) !== 'payment'
            || ($checkoutSession->payment_status ?? null) !== 'paid'
            || ! is_int($coinsAmount)
            || ! is_int($expectedAmount)
            || (int) ($checkoutSession->amount_total ?? 0) !== $expectedAmount
            || ! is_string($checkoutSession->id ?? null)
            || ! is_string($event->id ?? null)
        ) {
            Log::warning('Ignored Stripe Checkout event that does not match the coin purchase.', [
                'event_id' => $event->id ?? null,
                'session_id' => $checkoutSession->id ?? null,
                'client_reference_id' => $checkoutSession->client_reference_id ?? null,
                'mode' => $checkoutSession->mode ?? null,
                'payment_status' => $checkoutSession->payment_status ?? null,
                'currency' => $currency,
                'amount_total' => $checkoutSession->amount_total ?? null,
                'coins_amount' => $coinsAmount,
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

        DB::transaction(function () use ($user, $checkoutSession, $event, $coinsAmount): void {
            $inserted = DB::table('stripe_checkout_payments')->insertOrIgnore([
                'user_id' => $user->getKey(),
                'stripe_checkout_session_id' => $checkoutSession->id,
                'stripe_event_id' => $event->id,
                'coins' => $coinsAmount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($inserted === 1) {
                User::query()
                    ->whereKey($user->getKey())
                    ->increment('coins', $coinsAmount);
            }
        });

        return response()->noContent();
    }
}
