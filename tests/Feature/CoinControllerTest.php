<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoinControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_daily_claim_requires_authentication(): void
    {
        $response = $this->post('/coins/claim');

        $response->assertRedirect('/login');
    }

    public function test_daily_claim_adds_fifty_coins_when_available(): void
    {
        $this->travelTo(now()->setDate(2026, 9, 30)->startOfDay());
        $user = User::factory()->create(['coins' => 25]);

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/coins/claim');

        $response->assertRedirect('/dashboard')
            ->assertSessionHas('success', 'Votre récompense quotidienne de 50 pièces a été ajoutée.');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 75,
            'last_daily_claim' => now()->toDateTimeString(),
        ]);
    }

    public function test_daily_claim_is_rejected_with_remaining_time_before_twenty_four_hours(): void
    {
        $this->travelTo(now()->setDate(2026, 9, 30)->setTime(12, 0));
        $user = User::factory()->create([
            'coins' => 25,
            'last_daily_claim' => now()->subHours(23),
        ]);

        $response = $this->actingAs($user)
            ->from('/dashboard')
            ->post('/coins/claim');

        $response->assertRedirect('/dashboard')
            ->assertSessionHasErrors([
                'claim' => 'Votre prochaine récompense sera disponible dans 1 h.',
            ]);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 25,
            'last_daily_claim' => now()->subHours(23)->toDateTimeString(),
        ]);
    }

    public function test_daily_claim_is_throttled_after_five_requests_per_minute(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        for ($requestNumber = 0; $requestNumber < 5; $requestNumber++) {
            $this->post('/coins/claim');
        }

        $this->post('/coins/claim')->assertTooManyRequests();
    }
}
