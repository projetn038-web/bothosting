<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_displays_landing_page_and_search_metadata(): void
    {
        $response = $this->get('/');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Welcome'))
            ->assertSee('name="description"', false)
            ->assertSee('property="og:title"', false)
            ->assertSee('property="og:description"', false)
            ->assertSee('property="og:image"', false)
            ->assertSee('property="og:type"', false);
    }

    public function test_terms_page_is_public_and_renders_its_inertia_page(): void
    {
        $this->get('/cgu')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Legal/CGU'));
    }

    public function test_privacy_page_is_public_and_renders_its_inertia_page(): void
    {
        $this->get('/rgpd')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Legal/RGPD'));
    }
}
