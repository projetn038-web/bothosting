<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_page_is_displayed(): void
    {
        $response = $this->get('/admin/login');

        $response->assertOk();
    }

    public function test_admin_login_sets_the_session_with_the_configured_password(): void
    {
        config(['admin.password' => 'secret-admin-password']);

        $response = $this->post('/admin/login', [
            'password' => 'secret-admin-password',
        ]);

        $response->assertRedirect('/admin/dashboard')
            ->assertSessionHas('is_admin', true);
        $this->get('/admin/dashboard')->assertOk();
    }

    public function test_admin_login_rejects_an_incorrect_password(): void
    {
        config(['admin.password' => 'secret-admin-password']);

        $response = $this->from('/admin/login')->post('/admin/login', [
            'password' => 'incorrect-password',
        ]);

        $response->assertRedirect('/admin/login')
            ->assertSessionHasErrors([
                'password' => 'Le mot de passe administrateur est incorrect.',
            ])
            ->assertSessionMissing('is_admin');
    }

    public function test_admin_login_rejects_fields_other_than_password(): void
    {
        config(['admin.password' => 'secret-admin-password']);

        $response = $this->from('/admin/login')->post('/admin/login', [
            'password' => 'secret-admin-password',
            'email' => 'admin@example.com',
        ]);

        $response->assertRedirect('/admin/login')
            ->assertSessionHasErrors([
                'password' => 'Seul le champ mot de passe est accepté.',
            ])
            ->assertSessionMissing('is_admin');
    }

    public function test_admin_dashboard_redirects_to_home_without_admin_session(): void
    {
        $response = $this->get('/admin/dashboard');

        $response->assertRedirect('/');
    }

    public function test_admin_dashboard_rejects_a_non_boolean_admin_session_value(): void
    {
        $response = $this->withSession(['is_admin' => 'true'])
            ->get('/admin/dashboard');

        $response->assertRedirect('/');
    }

    public function test_admin_dashboard_displays_global_stats_and_all_bots_with_their_owners(): void
    {
        $owner = User::factory()->create(['coins' => 125]);
        $anotherUser = User::factory()->create(['coins' => 75]);
        $bot = $owner->botServers()->create([
            'name' => 'Production bot',
            'language' => 'nodejs',
            'ram_mb' => 1024,
            'cost_per_hour' => 10,
            'status' => 'active',
        ]);
        $newerBot = $anotherUser->botServers()->create([
            'name' => 'Suspended bot',
            'language' => 'python',
            'ram_mb' => 512,
            'cost_per_hour' => 5,
            'status' => 'suspended',
        ]);
        $newerBot->forceFill(['created_at' => now()->addSecond()])->saveQuietly();

        $response = $this->withSession(['is_admin' => true])
            ->get('/admin/dashboard');

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->where('stats.users', 2)
            ->where('stats.bots', 2)
            ->where('stats.coins', 200)
            ->has('servers', 2)
            ->where('servers.0.id', $newerBot->id)
            ->where('servers.0.name', 'Suspended bot')
            ->where('servers.0.user.name', $anotherUser->name)
            ->where('servers.1.id', $bot->id)
            ->where('servers.1.user.name', $owner->name));
    }
}
