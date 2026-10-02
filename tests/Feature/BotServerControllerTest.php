<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class BotServerControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_bot_creation_requires_authentication(): void
    {
        $response = $this->post('/bots', [
            'name' => 'My bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
        ]);

        $response->assertRedirect('/login');
    }

    public function test_valid_bot_is_created_with_server_calculated_cost_and_owner(): void
    {
        $this->fakePterodactylCreate();
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/bots', [
                'name' => 'My Python bot',
                'language' => 'python',
                'ram_mb' => '1024',
                'user_id' => $anotherUser->id,
                'cost_per_hour' => 1,
                'status' => 'suspended',
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHas('success', 'Votre bot a été créé.');
        $this->assertDatabaseHas('bot_servers', [
            'user_id' => $user->id,
            'pterodactyl_server_id' => '9001',
            'name' => 'My Python bot',
            'language' => 'python',
            'ram_mb' => 1024,
            'cost_per_hour' => 8,
            'status' => 'active',
        ]);
        $this->assertDatabaseMissing('bot_servers', [
            'user_id' => $anotherUser->id,
            'name' => 'My Python bot',
        ]);
        Http::assertSent(fn (Request $request) => $request->url() === 'https://panel.example.test/api/application/servers'
            && $request->method() === 'POST'
            && $request->hasHeader('Authorization', 'Bearer test-api-key')
            && $request->data()['name'] === 'My Python bot'
            && $request->data()['egg'] === 22
            && $request->data()['limits']['memory'] === 1024
            && $request->data()['deploy']['locations'] === [1]);
    }

    #[DataProvider('supportedMemoryTiers')]
    public function test_bot_hourly_cost_matches_the_selected_memory_size(
        int $ramMb,
        int $expectedHourlyCost,
    ): void {
        $this->fakePterodactylCreate();
        $user = User::factory()->create();

        $this->actingAs($user)->post('/bots', [
            'name' => 'Tiered bot',
            'language' => 'nodejs',
            'ram_mb' => $ramMb,
        ]);

        $this->assertDatabaseHas('bot_servers', [
            'user_id' => $user->id,
            'ram_mb' => $ramMb,
            'cost_per_hour' => $expectedHourlyCost,
        ]);
    }

    public function test_bot_is_not_saved_when_pterodactyl_rejects_creation(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers' => Http::response(['errors' => []], 503),
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/bots', [
                'name' => 'Unavailable bot',
                'language' => 'nodejs',
                'ram_mb' => 512,
            ]);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors('name');
        $this->assertDatabaseCount('bot_servers', 0);
    }

    public static function supportedMemoryTiers(): array
    {
        return [
            '512 MB' => [512, 4],
            '1 GB' => [1024, 8],
            '2 GB' => [2048, 15],
        ];
    }

    #[DataProvider('invalidBotData')]
    public function test_bot_creation_rejects_invalid_input(array $input, string $field): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/bots', $input);

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors($field);
        $this->assertDatabaseCount('bot_servers', 0);
    }

    public static function invalidBotData(): array
    {
        return [
            'missing name' => [
                ['language' => 'nodejs', 'ram_mb' => 512],
                'name',
            ],
            'long name' => [
                ['name' => str_repeat('a', 256), 'language' => 'nodejs', 'ram_mb' => 512],
                'name',
            ],
            'unsupported language' => [
                ['name' => 'My bot', 'language' => 'ruby', 'ram_mb' => 512],
                'language',
            ],
            'unsupported memory size' => [
                ['name' => 'My bot', 'language' => 'nodejs', 'ram_mb' => 768],
                'ram_mb',
            ],
            'non integer memory size' => [
                ['name' => 'My bot', 'language' => 'nodejs', 'ram_mb' => '512.5'],
                'ram_mb',
            ],
        ];
    }

    private function fakePterodactylCreate(): void
    {
        $this->configurePterodactyl();
        Http::preventStrayRequests();
        Http::fake([
            'panel.example.test/api/application/servers' => Http::response([
                'attributes' => ['id' => 9001],
            ], 201),
        ]);
    }

    private function configurePterodactyl(): void
    {
        config([
            'services.pterodactyl.url' => 'https://panel.example.test',
            'services.pterodactyl.api_key' => 'test-api-key',
            'services.pterodactyl.eggs.nodejs' => 11,
            'services.pterodactyl.eggs.python' => 22,
            'services.pterodactyl.user_id' => 1,
            'services.pterodactyl.location_id' => 1,
        ]);
    }

    public function test_dashboard_lists_only_the_authenticated_users_bots_in_latest_order(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();

        $olderBot = $user->botServers()->create([
            'name' => 'Older bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'active',
        ]);
        $olderBot->forceFill(['created_at' => now()->subMinute()])->saveQuietly();
        $latestBot = $user->botServers()->create([
            'name' => 'Latest bot',
            'language' => 'python',
            'ram_mb' => 2048,
            'cost_per_hour' => 20,
            'status' => 'suspended',
        ]);
        $anotherUser->botServers()->create([
            'name' => 'Private bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->has('bots', 2)
            ->where('bots.0.id', $latestBot->id)
            ->where('bots.0.cost_per_hour', 15)
            ->where('bots.1.id', $olderBot->id)
            ->where('bots.1.cost_per_hour', 4));
    }
}
