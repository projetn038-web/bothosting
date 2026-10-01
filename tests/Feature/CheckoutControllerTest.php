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
            ->post('/buy-coins', ['currency' => 'eur']);

        $response->assertStatus(409)
            ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/session/123');
        $this->assertSame('post', $stripeClient->request['method']);
        $this->assertSame('https://api.stripe.com/v1/checkout/sessions', $stripeClient->request['absUrl']);
        $this->assertSame((string) $user->id, $stripeClient->request['params']['client_reference_id']);
        $this->assertSame('payment', $stripeClient->request['params']['mode']);
        $this->assertSame('eur', $stripeClient->request['params']['line_items'][0]['price_data']['currency']);
        $this->assertSame(500, $stripeClient->request['params']['line_items'][0]['price_data']['unit_amount']);
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
            ->post('/buy-coins', ['currency' => 'eur']);

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
            ->post('/buy-coins', ['currency' => 'xof']);

        $response->assertStatus(409)
            ->assertHeader('X-Inertia-Location', 'https://checkout.stripe.test/session/xof');
        $this->assertSame('xof', $stripeClient->request['params']['line_items'][0]['price_data']['currency']);
        $this->assertSame(3500, $stripeClient->request['params']['line_items'][0]['price_data']['unit_amount']);
        $this->assertSame(20, $user->fresh()->coins);
    }

    public function test_checkout_rejects_unsupported_currencies(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/buy-coins', ['currency' => 'usd']);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('currency');
        $this->assertSame(0, $user->fresh()->coins);
    }

    public function test_checkout_simulates_a_purchase_when_stripe_is_not_configured_locally(): void
    {
        $this->app->detectEnvironment(fn () => 'local');
        config(['services.stripe.secret' => '']);
        $user = User::factory()->create(['coins' => 20]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PreventRequestForgery::class)
            ->from('/dashboard')
            ->post('/buy-coins', ['currency' => 'eur']);

        $response->assertRedirect('/dashboard')
            ->assertSessionHas(
                'success',
                '[DEV MODE] 1000 pièces ajoutées (Clés Stripe manquantes).',
            );
        $this->assertSame(1020, $user->fresh()->coins);
    }
}
