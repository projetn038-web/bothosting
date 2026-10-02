<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_registration_screen_accepts_a_valid_referral_code_from_the_url(): void
    {
        $referrer = User::factory()->create();

        $response = $this->get(route('register', ['ref' => strtolower($referrer->referral_code)]));

        $response->assertInertia(fn ($page) => $page
            ->component('Auth/Register')
            ->where('referralCode', $referrer->referral_code));
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'coins' => 0,
            'referred_by' => null,
        ]);

        $user = User::query()->where('email', 'test@example.com')->firstOrFail();
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{8}$/', $user->referral_code);
    }

    public function test_registration_with_a_referral_code_rewards_both_users_once(): void
    {
        $referrer = User::factory()->create(['coins' => 50]);

        $response = $this->post('/register', [
            'name' => 'Referred User',
            'email' => 'referred@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'referral_code' => $referrer->referral_code,
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'referred@example.com',
            'coins' => 200,
            'referred_by' => $referrer->id,
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $referrer->id,
            'coins' => 550,
        ]);

        $referredUser = User::query()->where('email', 'referred@example.com')->firstOrFail();
        $this->assertTrue($referredUser->referrer->is($referrer));
        $this->assertTrue($referrer->fresh()->referrals->contains($referredUser));
    }

    public function test_registration_with_an_unknown_referral_code_does_not_grant_rewards(): void
    {
        $response = $this->post('/register', [
            'name' => 'Regular User',
            'email' => 'regular@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'referral_code' => 'UNKNOWN1',
        ]);

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'email' => 'regular@example.com',
            'coins' => 0,
            'referred_by' => null,
        ]);
    }

    public function test_dashboard_includes_referral_link_and_referral_count(): void
    {
        $referrer = User::factory()->create();
        User::factory()->create()
            ->forceFill(['referred_by' => $referrer->id])
            ->save();

        $response = $this->actingAs($referrer)->get(route('dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard')
            ->where('referralUrl', route('register', ['ref' => $referrer->referral_code]))
            ->where('referralsCount', 1)
            ->where('coinPackages.700.prices.eur', 200)
            ->where('coinPackages.700.prices.xof', 1300)
            ->where('coinPackages.2000.prices.eur', 500)
            ->where('coinPackages.2000.prices.xof', 3200)
            ->where('coinPackages.5000.prices.eur', 1000)
            ->where('coinPackages.5000.prices.xof', 6500));
    }
}
