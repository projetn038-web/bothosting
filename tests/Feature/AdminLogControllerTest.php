<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLogControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_logs_require_an_admin_session(): void
    {
        $this->get(route('admin.logs.index'))->assertRedirect('/');
    }

    public function test_admin_can_view_system_logs(): void
    {
        $response = $this->withSession(['is_admin' => true])
            ->get(route('admin.logs.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Logs/Index')
            ->has('logs')
            ->has('logAvailable'));
    }
}
