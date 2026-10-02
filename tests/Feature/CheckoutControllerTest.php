<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Stripe\ApiRequestor;
use Stripe\HttpClient\ClientInterface;
use Stripe\HttpClient\CurlClient;
use Stripe\Stripe;
use Tests\TestCase;

class CheckoutControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        ApiRequestor::setHttpClient(new CurlClient);
        Stripe::setApiKey('');

        parent::tearDown();
    }

    public function test_checkout_requires_authentication(): void
    {
        $this->post('/buy-coins')->assertRedirect('/login');
    }

    public function test_checkout_creates_a_fixed_price_session_for_the_authenticated_user(): void
    {
        config(['services.stripe.secret' => 'sk_test_checkout']);
        $stripeClient = new class implements ClientInterface
        {
            public array $request = [];

            public function request(
                $method,
                $absUrl,
                $headers,
                $params,
                $hasFile,
                $apiMode = 'v1',
                $maxNetworkRetries = null,
            ) {
                $this->request = compact('method', 'absUrl', 'params');

                return [
                    json_encode([
                        'id' => 'cs_test_123',
                        'object' => 'checkout.session',
                        'url' => 'https://checkout.stripe.test/session/123',
                    ], JSON_THROW_ON_ERROR),
                    200,
                    ['Request-Id' => 'req_test_123'],
                ];
            }
        };
        ApiRequestor::setHttpClient($stripeClient);
        $user = User::factory()->create(['coins' => 20]);

        $response = $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->post('/buy-coins', [
                'coins_amount' => 2000,
                'currency' => 'eur',
                'payment_method' => 'stripe',
            ]);

        $response->assertStatus(409)
            ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/session/123');
        $this->assertSame('post', $stripeClient->request['method']);
        $this->assertSame('https://api.stripe.com/v1/checkout/sessions', $stripeClient->request['absUrl']);
        $this->assertSame((string) $user->id, $stripeClient->request['params']['client_reference_id']);
        $this->assertSame('payment', $stripeClient->request['params']['mode']);
        $this->assertSame('eur', $stripeClient->request['params']['line_items'][0]['price_data']['currency']);
        $this->assertSame(500, $stripeClient->request['params']['line_items'][0]['price_data']['unit_amount']);
        $this->assertSame('2000', $stripeClient->request['params']['metadata']['coins_amount']);
        $this->assertSame('Pro - 2000 pièces', $stripeClient->request['params']['line_items'][0]['price_data']['product_data']['name']);
        $this->assertSame(1, $stripeClient->request['params']['line_items'][0]['quantity']);
        $this->assertSame(20, $user->fresh()->coins);
    }

    public function test_checkout_reports_unavailable_when_secret_is_not_configured(): void
    {
        config(['app.env' => 'production']);
        config(['services.stripe.secret' => '']);
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 700,
                'currency' => 'eur',
                'payment_method' => 'stripe',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('checkout');
    }

    public function test_checkout_creates_a_zero_decimal_xof_session(): void
    {
        config(['services.stripe.secret' => 'sk_test_checkout']);
        $stripeClient = new class implements ClientInterface
        {
            public array $request = [];

            public function request(
                $method,
                $absUrl,
                $headers,
                $params,
                $hasFile,
                $apiMode = 'v1',
                $maxNetworkRetries = null,
            ) {
                $this->request = compact('method', 'absUrl', 'params');

                return [
                    json_encode([
                        'id' => 'cs_test_xof',
                        'object' => 'checkout.session',
                        'url' => 'https://checkout.stripe.test/session/xof',
                    ], JSON_THROW_ON_ERROR),
                    200,
                    ['Request-Id' => 'req_test_xof'],
                ];
            }
        };
        ApiRequestor::setHttpClient($stripeClient);
        $user = User::factory()->create(['coins' => 20]);

        $response = $this->actingAs($user)
            ->withHeader('X-Inertia', 'true')
            ->post('/buy-coins', [
                'coins_amount' => 5000,
                'currency' => 'xof',
                'payment_method' => 'stripe',
            ]);

        $response->assertStatus(409)
            ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/session/xof');
        $this->assertSame('xof', $stripeClient->request['params']['line_items'][0]['price_data']['currency']);
        $this->assertSame(6500, $stripeClient->request['params']['line_items'][0]['price_data']['unit_amount']);
        $this->assertSame('5000', $stripeClient->request['params']['metadata']['coins_amount']);
        $this->assertSame(20, $user->fresh()->coins);
    }

    public function test_checkout_uses_the_configured_price_for_every_package_and_currency(): void
    {
        config(['services.stripe.secret' => 'sk_test_checkout']);
        $stripeClient = new class implements ClientInterface
        {
            public array $request = [];

            public function request(
                $method,
                $absUrl,
                $headers,
                $params,
                $hasFile,
                $apiMode = 'v1',
                $maxNetworkRetries = null,
            ) {
                $this->request = compact('method', 'absUrl', 'params');

                return [
                    json_encode([
                        'id' => 'cs_test_package',
                        'object' => 'checkout.session',
                        'url' => 'https://checkout.stripe.test/session/package',
                    ], JSON_THROW_ON_ERROR),
                    200,
                    ['Request-Id' => 'req_test_package'],
                ];
            }
        };
        ApiRequestor::setHttpClient($stripeClient);
        $user = User::factory()->create();
        $this->actingAs($user);

        foreach ([
            [700, 'eur', 200],
            [700, 'xof', 1300],
            [2000, 'eur', 500],
            [2000, 'xof', 3200],
            [5000, 'eur', 1000],
            [5000, 'xof', 6500],
        ] as [$coinsAmount, $currency, $price]) {
            $this->withHeader('X-Inertia', 'true')
                ->post('/buy-coins', [
                    'coins_amount' => $coinsAmount,
                    'currency' => $currency,
                    'payment_method' => 'stripe',
                ])
                ->assertStatus(409);

            $this->assertSame($currency, $stripeClient->request['params']['line_items'][0]['price_data']['currency']);
            $this->assertSame($price, $stripeClient->request['params']['line_items'][0]['price_data']['unit_amount']);
            $this->assertSame((string) $coinsAmount, $stripeClient->request['params']['metadata']['coins_amount']);
        }
    }

    public function test_checkout_rejects_unsupported_currencies(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 700,
                'currency' => 'usd',
                'payment_method' => 'stripe',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('currency');
        $this->assertSame(0, $user->fresh()->coins);
    }

    public function test_checkout_rejects_unsupported_payment_methods(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 700,
                'currency' => 'eur',
                'payment_method' => 'bank_transfer',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('payment_method');
        $this->assertSame(0, $user->fresh()->coins);
    }

    public function test_checkout_rejects_unlisted_packages(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 1000,
                'currency' => 'eur',
                'payment_method' => 'stripe',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('coins_amount');
        $this->assertSame(0, $user->fresh()->coins);
    }

    public function test_mobile_money_checkout_returns_the_integration_message(): void
    {
        config(['services.stripe.secret' => 'sk_test_checkout']);
        $user = User::factory()->create(['coins' => 20]);

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 700,
                'currency' => 'xof',
                'payment_method' => 'mobile_money',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHas('success', 'Paiement Mobile Money en cours d’intégration.');
        $this->assertSame(20, $user->fresh()->coins);
    }

    public function test_checkout_simulates_the_requested_package_locally_for_any_payment_method(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        config(['services.stripe.secret' => '']);
        $user = User::factory()->create(['coins' => 20]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PreventRequestForgery::class)
            ->from('/dashboard')
            ->post('/buy-coins', [
                'coins_amount' => 2000,
                'currency' => 'eur',
                'payment_method' => 'mobile_money',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHas(
                'success',
                '[DEV MODE] 2000 pièces ajoutées (Clés Stripe manquantes).',
            );
        $this->assertSame(2020, $user->fresh()->coins);
    }
}
