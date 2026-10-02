<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_successful_login_records_the_current_time_and_ip_address(): void
    {
        $user = User::factory()->create();
        $this->travelTo('2026-10-02 13:00:00');

        $response = $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.42'])
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'last_login_at' => '2026-10-02 13:00:00',
            'last_login_ip' => '203.0.113.42',
        ]);
    }

    public function test_banned_user_is_logged_out_and_redirected_to_login_with_an_error(): void
    {
        $user = User::factory()->create(['is_banned' => true]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertRedirect(route('login'))
            ->assertSessionHasErrors([
                'email' => 'Votre compte a été suspendu.',
            ]);
        $this->assertGuest();
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }
}
