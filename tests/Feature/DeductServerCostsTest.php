<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DeductServerCostsTest extends TestCase
{
    use RefreshDatabase;

    public function test_hourly_billing_debits_affordable_bots_and_suspends_bots_without_funds(): void
    {
        $user = User::factory()->create(['coins' => 12]);
        $firstBot = $user->botServers()->create([
            'name' => 'First bot',
            'language' => 'nodejs',
            'ram_mb' => 1024,
            'cost_per_hour' => 10,
            'status' => 'active',
        ]);
        $secondBot = $user->botServers()->create([
            'name' => 'Second bot',
            'language' => 'python',
            'ram_mb' => 1024,
            'cost_per_hour' => 10,
            'status' => 'active',
        ]);
        $inactiveUser = User::factory()->create(['coins' => 0]);
        $suspendedBot = $inactiveUser->botServers()->create([
            'name' => 'Already suspended',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'suspended',
        ]);

        $this->artisan('billing:hourly')->assertSuccessful();

        $this->assertSame(2, $user->fresh()->coins);
        $this->assertSame('active', $firstBot->fresh()->status);
        $this->assertSame('suspended', $secondBot->fresh()->status);
        $this->assertSame(0, $inactiveUser->fresh()->coins);
        $this->assertSame('suspended', $suspendedBot->fresh()->status);
    }

    public function test_hourly_billing_suspends_an_unpaid_server_in_pterodactyl(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers/42/suspend' => Http::response([], 204),
        ]);
        $user = User::factory()->create(['coins' => 0]);
        $server = $user->botServers()->create([
            'pterodactyl_server_id' => '42',
            'name' => 'Unpaid bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'active',
        ]);

        $this->artisan('billing:hourly')->assertSuccessful();

        $this->assertSame('suspended', $server->fresh()->status);
        Http::assertSent(fn (Request $request) => $request->url() === 'https://panel.example.test/api/application/servers/42/suspend'
            && $request->method() === 'POST');
    }

    public function test_failed_pterodactyl_suspension_leaves_the_bot_active_for_retry(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers/42/suspend' => Http::response([], 503),
        ]);
        $user = User::factory()->create(['coins' => 0]);
        $server = $user->botServers()->create([
            'pterodactyl_server_id' => '42',
            'name' => 'Unpaid bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'active',
        ]);

        $this->artisan('billing:hourly')->assertFailed();

        $this->assertSame('active', $server->fresh()->status);
    }

    private function configurePterodactyl(): void
    {
        config([
            'services.pterodactyl.url' => 'https://panel.example.test',
            'services.pterodactyl.api_key' => 'test-api-key',
        ]);
    }
}
