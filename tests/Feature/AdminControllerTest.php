<?php

namespace Tests\Feature;

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
}
