<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebhookControllerTest extends TestCase
{
    use RefreshDatabase;

    private const WEBHOOK_SECRET = 'whsec_checkout_test';

    public function test_paid_checkout_webhook_adds_coins_to_the_referenced_user(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload($user->id);

        $response = $this->postStripeWebhook($payload);

        $response->assertNoContent();
        $this->assertSame(775, $user->fresh()->coins);
        $this->assertDatabaseHas('stripe_checkout_payments', [
            'user_id' => $user->id,
            'stripe_checkout_session_id' => 'cs_test_paid',
            'stripe_event_id' => 'evt_test_paid',
            'coins' => 700,
        ]);
    }

    public function test_replaying_a_paid_checkout_webhook_does_not_add_coins_twice(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload($user->id);

        $this->postStripeWebhook($payload)->assertNoContent();
        $this->postStripeWebhook($payload)->assertNoContent();

        $this->assertSame(775, $user->fresh()->coins);
        $this->assertDatabaseCount('stripe_checkout_payments', 1);
    }

    public function test_webhook_rejects_an_invalid_signature_without_crediting_coins(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload($user->id);

        $this->call(
            'POST',
            '/webhook/stripe',
            [],
            [],
            [],
            ['CONTENT_TYPE' => 'application/json', 'HTTP_STRIPE_SIGNATURE' => 't=1,v1=invalid'],
            $payload,
        )->assertBadRequest();

        $this->assertSame(75, $user->fresh()->coins);
        $this->assertDatabaseCount('stripe_checkout_payments', 0);
    }

    public function test_unpaid_checkout_session_is_acknowledged_without_crediting_coins(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload($user->id, paymentStatus: 'unpaid');

        $this->postStripeWebhook($payload)->assertNoContent();

        $this->assertSame(75, $user->fresh()->coins);
        $this->assertDatabaseCount('stripe_checkout_payments', 0);
    }

    public function test_asynchronous_payment_success_credits_the_user_once(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload(
            $user->id,
            eventType: 'checkout.session.async_payment_succeeded',
        );

        $this->postStripeWebhook($payload)->assertNoContent();

        $this->assertSame(775, $user->fresh()->coins);
        $this->assertDatabaseCount('stripe_checkout_payments', 1);
    }

    public function test_paid_xof_elite_checkout_credits_the_package_coins(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload(
            $user->id,
            coinsAmount: 5000,
            currency: 'xof',
            amountTotal: 6500,
        );

        $this->postStripeWebhook($payload)->assertNoContent();

        $this->assertSame(5075, $user->fresh()->coins);
        $this->assertDatabaseHas('stripe_checkout_payments', [
            'user_id' => $user->id,
            'coins' => 5000,
        ]);
    }

    public function test_webhook_does_not_credit_a_package_with_a_mismatched_price(): void
    {
        config(['services.stripe.webhook_secret' => self::WEBHOOK_SECRET]);
        $user = User::factory()->create(['coins' => 75]);
        $payload = $this->checkoutEventPayload(
            $user->id,
            coinsAmount: 5000,
            currency: 'eur',
            amountTotal: 200,
        );

        $this->postStripeWebhook($payload)->assertNoContent();

        $this->assertSame(75, $user->fresh()->coins);
        $this->assertDatabaseCount('stripe_checkout_payments', 0);
    }

    private function checkoutEventPayload(
        int $userId,
        string $paymentStatus = 'paid',
        string $eventType = 'checkout.session.completed',
        int $coinsAmount = 700,
        string $currency = 'eur',
        int $amountTotal = 200,
    ): string {
        return json_encode([
            'id' => 'evt_test_paid',
            'object' => 'event',
            'type' => $eventType,
            'data' => [
                'object' => [
                    'id' => 'cs_test_paid',
                    'object' => 'checkout.session',
                    'client_reference_id' => (string) $userId,
                    'mode' => 'payment',
                    'payment_status' => $paymentStatus,
                    'currency' => $currency,
                    'amount_total' => $amountTotal,
                    'metadata' => [
                        'coins_amount' => (string) $coinsAmount,
                    ],
                ],
            ],
        ], JSON_THROW_ON_ERROR);
    }

    private function postStripeWebhook(string $payload)
    {
        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, self::WEBHOOK_SECRET);

        return $this->call(
            'POST',
            '/webhook/stripe',
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
            ],
            $payload,
        );
    }
}
