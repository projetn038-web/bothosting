<?php

namespace Tests\Feature;

use App\Services\PterodactylService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PterodactylServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_server_returns_the_panel_server_id(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers' => Http::response([
                'attributes' => ['id' => 456],
            ], 201),
        ]);

        $serverId = app(PterodactylService::class)->createServer('Test bot', 'nodejs', 1024);

        $this->assertSame('456', $serverId);
        Http::assertSent(fn (Request $request) => $request->url() === 'https://panel.example.test/api/application/servers'
            && $request->data()['user'] === 7
            && $request->data()['egg'] === 11
            && $request->data()['docker_image'] === 'ghcr.io/parkervcp/yolks:nodejs_22'
            && $request->data()['limits']['memory'] === 1024
            && $request->data()['deploy']['locations'] === [3]);
    }

    public function test_suspend_and_unsuspend_call_the_matching_panel_actions(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers/456/suspend' => Http::response([], 204),
            'panel.example.test/api/application/servers/456/unsuspend' => Http::response([], 204),
        ]);
        $service = app(PterodactylService::class);

        $service->suspendServer('456');
        $service->unsuspendServer('456');

        Http::assertSent(fn (Request $request) => $request->url() === 'https://panel.example.test/api/application/servers/456/suspend'
            && $request->method() === 'POST');
        Http::assertSent(fn (Request $request) => $request->url() === 'https://panel.example.test/api/application/servers/456/unsuspend'
            && $request->method() === 'POST');
    }

    private function configurePterodactyl(): void
    {
        config([
            'services.pterodactyl.url' => 'https://panel.example.test',
            'services.pterodactyl.api_key' => 'test-api-key',
            'services.pterodactyl.eggs.nodejs' => 11,
            'services.pterodactyl.user_id' => 7,
            'services.pterodactyl.location_id' => 3,
        ]);
    }
}
