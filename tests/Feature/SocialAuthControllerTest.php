<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class SocialAuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_redirected_to_a_supported_oauth_provider(): void
    {
        Socialite::fake('google');

        $response = $this->get('/auth/google/redirect');

        $response->assertRedirect();
    }

    public function test_unknown_oauth_providers_are_not_routable(): void
    {
        $this->get('/auth/linkedin/redirect')->assertNotFound();
        $this->get('/auth/linkedin/callback')->assertNotFound();
    }

    public function test_google_callback_creates_a_verified_user_and_authenticates_them(): void
    {
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-123',
            'name' => 'Google Person',
            'email' => 'GOOGLE@example.com',
            'email_verified' => true,
            'avatar' => 'https://example.com/google-avatar.png',
        ]));

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'name' => 'Google Person',
            'email' => 'google@example.com',
            'google_id' => 'google-123',
            'avatar' => 'https://example.com/google-avatar.png',
            'coins' => 200,
        ]);

        $user = User::query()->where('google_id', 'google-123')->firstOrFail();
        $this->assertNotNull($user->email_verified_at);
        $this->assertNotEmpty($user->password);
        $this->assertMatchesRegularExpression('/^[A-Z0-9]{8}$/', $user->referral_code);
    }

    public function test_github_callback_creates_a_verified_user_and_authenticates_them(): void
    {
        Socialite::fake('github', SocialiteUser::fake([
            'id' => 'github-456',
            'name' => 'GitHub Person',
            'email' => 'github@example.com',
            'avatar' => 'https://example.com/github-avatar.png',
        ]));

        $response = $this->get('/auth/github/callback');

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'github@example.com',
            'github_id' => 'github-456',
            'avatar' => 'https://example.com/github-avatar.png',
            'coins' => 200,
        ]);
        $this->assertNotNull(User::query()->where('github_id', 'github-456')->firstOrFail()->email_verified_at);
    }

    public function test_callback_links_a_verified_provider_to_an_existing_email_without_awarding_coins(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'coins' => 850,
        ]);
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-existing',
            'email' => 'existing@example.com',
            'email_verified' => true,
            'avatar' => 'https://example.com/new-avatar.png',
        ]));

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertAuthenticatedAs($existingUser);
        $this->assertDatabaseHas('users', [
            'id' => $existingUser->id,
            'google_id' => 'google-existing',
            'avatar' => 'https://example.com/new-avatar.png',
            'coins' => 850,
        ]);
        $this->assertNotNull($existingUser->fresh()->email_verified_at);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_google_callback_rejects_an_unverified_email(): void
    {
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-unverified',
            'email' => 'unverified@example.com',
            'email_verified' => false,
        ]));

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_callback_rejects_a_provider_profile_without_an_email(): void
    {
        Socialite::fake('github', SocialiteUser::fake([
            'id' => 'github-no-email',
            'email' => null,
        ]));

        $response = $this->get('/auth/github/callback');

        $response->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_callback_does_not_replace_a_different_identity_already_linked_to_the_email(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'linked@example.com',
            'google_id' => 'google-original',
            'coins' => 75,
        ]);
        Socialite::fake('google', SocialiteUser::fake([
            'id' => 'google-conflict',
            'email' => 'linked@example.com',
            'email_verified' => true,
        ]));

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('login'))
            ->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->assertDatabaseHas('users', [
            'id' => $existingUser->id,
            'google_id' => 'google-original',
            'coins' => 75,
        ]);
    }
}
