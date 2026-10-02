<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_user_routes_require_an_admin_session(): void
    {
        $user = User::factory()->create();

        $this->get(route('admin.users.index'))->assertRedirect('/');
        $this->post(route('admin.users.toggle-ban', $user))->assertRedirect('/');
        $this->post(route('admin.users.coins', $user), [
            'amount' => 100,
        ])->assertRedirect('/');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_banned' => false,
            'coins' => 0,
        ]);
    }

    public function test_admin_user_index_includes_login_state_and_bot_counts(): void
    {
        $user = User::factory()->create([
            'coins' => 275,
            'last_login_at' => '2026-10-01 12:30:00',
            'last_login_ip' => '203.0.113.9',
            'is_banned' => true,
        ]);
        $user->botServers()->create([
            'name' => 'My bot',
            'language' => 'nodejs',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'active',
        ]);

        $response = $this->withSession(['is_admin' => true])
            ->get(route('admin.users.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Users/Index')
            ->has('users', 1)
            ->where('users.0.id', $user->id)
            ->where('users.0.coins', 275)
            ->where('users.0.last_login_ip', '203.0.113.9')
            ->where('users.0.is_banned', true)
            ->where('users.0.bot_servers_count', 1));
    }

    public function test_admin_can_toggle_a_users_ban_status(): void
    {
        $user = User::factory()->create();

        $this->withSession(['is_admin' => true])
            ->post(route('admin.users.toggle-ban', $user))
            ->assertSessionHas('success', 'Le compte a été suspendu.');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_banned' => true,
        ]);

        $this->post(route('admin.users.toggle-ban', $user))
            ->assertSessionHas('success', 'Le compte a été réactivé.');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_banned' => false,
        ]);
    }

    public function test_admin_can_adjust_coins_by_positive_or_negative_amounts(): void
    {
        $user = User::factory()->create(['coins' => 100]);

        $this->withSession(['is_admin' => true])
            ->post(route('admin.users.coins', $user), ['amount' => 50])
            ->assertSessionHas('success', 'Le solde de pièces a été mis à jour.');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 150,
        ]);

        $this->post(route('admin.users.coins', $user), ['amount' => -25])
            ->assertSessionHas('success', 'Le solde de pièces a été mis à jour.');
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 125,
        ]);
    }

    public function test_admin_coin_adjustment_rejects_invalid_amounts_and_negative_balance(): void
    {
        $user = User::factory()->create(['coins' => 20]);

        $this->withSession(['is_admin' => true])
            ->from(route('admin.users.index'))
            ->post(route('admin.users.coins', $user), ['amount' => -21])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHasErrors([
                'amount' => 'Cette modification dépasserait le solde autorisé.',
            ]);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 20,
        ]);

        $this->from(route('admin.users.index'))
            ->post(route('admin.users.coins', $user), ['amount' => 0])
            ->assertRedirect(route('admin.users.index'))
            ->assertSessionHasErrors(['amount']);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'coins' => 20,
        ]);
    }
}
