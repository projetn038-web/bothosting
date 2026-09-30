<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
