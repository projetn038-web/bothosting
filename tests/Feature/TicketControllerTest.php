<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_pages_and_actions_require_authentication(): void
    {
        $this->get('/support/tickets')->assertRedirect('/login');
        $this->post('/support/tickets', [
            'subject' => 'Help',
            'message' => 'I need assistance.',
        ])->assertRedirect('/login');
    }

    public function test_ticket_creation_saves_the_ticket_and_initial_reply(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/support/tickets')
            ->post('/support/tickets', [
                'subject' => 'Bot deployment',
                'message' => 'My bot does not start.',
            ]);

        $ticket = Ticket::query()->firstOrFail();

        $response->assertRedirect(route('support.show', $ticket))
            ->assertSessionHas('success', 'Votre ticket a été créé.');
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'user_id' => $user->id,
            'subject' => 'Bot deployment',
            'status' => 'open',
        ]);
        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => 'My bot does not start.',
        ]);
    }

    public function test_ticket_creation_rejects_missing_subject_and_message(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from('/support/tickets')
            ->post('/support/tickets', [
                'subject' => '',
                'message' => '',
            ]);

        $response->assertRedirect('/support/tickets')
            ->assertSessionHasErrors(['subject', 'message']);
        $this->assertDatabaseCount('tickets', 0);
        $this->assertDatabaseCount('ticket_replies', 0);
    }

    public function test_ticket_list_contains_only_the_authenticated_users_tickets(): void
    {
        $user = User::factory()->create();
        $anotherUser = User::factory()->create();
        $ownTicket = $user->tickets()->create(['subject' => 'My request']);
        $anotherUser->tickets()->create(['subject' => 'Private request']);

        $response = $this->actingAs($user)->get('/support/tickets');

        $response->assertInertia(fn ($page) => $page
            ->component('Support/Index')
            ->has('tickets', 1)
            ->where('tickets.0.id', $ownTicket->id)
            ->where('tickets.0.subject', 'My request'));
    }

    public function test_ticket_conversation_includes_each_reply_author(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);
        $ticket->replies()->create([
            'user_id' => $user->id,
            'message' => 'Initial question',
        ]);

        $response = $this->actingAs($user)
            ->get(route('support.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('Support/Show')
            ->where('ticket.id', $ticket->id)
            ->where('ticket.replies.0.message', 'Initial question')
            ->where('ticket.replies.0.user.name', $user->name));
    }

    public function test_ticket_conversation_includes_support_replies_without_a_customer_author(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);
        $ticket->replies()->create([
            'user_id' => null,
            'message' => 'The support team replied.',
        ]);

        $response = $this->actingAs($user)
            ->get(route('support.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('Support/Show')
            ->where('ticket.replies.0.user_id', null)
            ->where('ticket.replies.0.message', 'The support team replied.'));
    }

    public function test_user_cannot_read_or_reply_to_another_users_ticket(): void
    {
        $owner = User::factory()->create();
        $anotherUser = User::factory()->create();
        $ticket = $owner->tickets()->create(['subject' => 'Private request']);

        $this->actingAs($anotherUser)
            ->get(route('support.show', $ticket))
            ->assertNotFound();
        $this->actingAs($anotherUser)
            ->post(route('support.reply', $ticket), ['message' => 'Intrusion'])
            ->assertNotFound();

        $this->assertDatabaseCount('ticket_replies', 0);
    }

    public function test_ticket_reply_is_saved_for_its_authenticated_author(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);

        $response = $this->actingAs($user)
            ->from(route('support.show', $ticket))
            ->post(route('support.reply', $ticket), [
                'message' => 'Here is more information.',
            ]);

        $response->assertRedirect(route('support.show', $ticket))
            ->assertSessionHas('success', 'Votre réponse a été envoyée.');
        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => 'Here is more information.',
        ]);
    }

    public function test_closed_ticket_rejects_replies_without_persisting_them(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create([
            'subject' => 'Resolved request',
            'status' => 'closed',
        ]);

        $response = $this->actingAs($user)
            ->from(route('support.show', $ticket))
            ->post(route('support.reply', $ticket), [
                'message' => 'One more question.',
            ]);

        $response->assertRedirect(route('support.show', $ticket))
            ->assertSessionHasErrors([
                'message' => 'Ce ticket est fermé et ne peut plus recevoir de réponse.',
            ]);
        $this->assertDatabaseCount('ticket_replies', 0);
    }
}
