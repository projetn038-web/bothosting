<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\TicketReplyNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AdminTicketControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_ticket_routes_redirect_without_an_admin_session(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);

        $this->get(route('admin.tickets.index'))->assertRedirect('/');
        $this->get(route('admin.tickets.show', $ticket))->assertRedirect('/');
        $this->post(route('admin.tickets.reply', $ticket), [
            'message' => 'A reply',
        ])->assertRedirect('/');
        $this->post(route('admin.tickets.close', $ticket))->assertRedirect('/');

        $this->assertDatabaseCount('ticket_replies', 0);
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'open',
        ]);
    }

    public function test_ticket_index_shows_open_tickets_first_with_their_users(): void
    {
        $user = User::factory()->create(['name' => 'Ticket owner']);
        $openTicket = $user->tickets()->create(['subject' => 'Open request']);
        $closedTicket = $user->tickets()->create([
            'subject' => 'Closed request',
            'status' => 'closed',
        ]);
        $closedTicket->forceFill(['created_at' => now()->addMinute()])->saveQuietly();

        $response = $this->withSession(['is_admin' => true])
            ->get(route('admin.tickets.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Tickets/Index')
            ->has('tickets', 2)
            ->where('tickets.0.id', $openTicket->id)
            ->where('tickets.0.user.name', 'Ticket owner')
            ->where('tickets.1.id', $closedTicket->id));
    }

    public function test_admin_can_view_ticket_and_all_reply_authors(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);
        $ticket->replies()->create([
            'user_id' => $user->id,
            'message' => 'Customer question',
        ]);

        $response = $this->withSession(['is_admin' => true])
            ->get(route('admin.tickets.show', $ticket));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Tickets/Show')
            ->where('ticket.id', $ticket->id)
            ->where('ticket.user.email', $user->email)
            ->where('ticket.replies.0.message', 'Customer question')
            ->where('ticket.replies.0.user.name', $user->name));
    }

    public function test_admin_reply_is_saved_as_a_support_message_without_a_customer_author(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);

        $response = $this->withSession(['is_admin' => true])
            ->from(route('admin.tickets.show', $ticket))
            ->post(route('admin.tickets.reply', $ticket), [
                'message' => 'We are looking into this.',
            ]);

        $response->assertRedirect(route('admin.tickets.show', $ticket))
            ->assertSessionHas('success', 'Votre réponse a été envoyée.');
        $this->assertDatabaseHas('ticket_replies', [
            'ticket_id' => $ticket->id,
            'user_id' => null,
            'message' => 'We are looking into this.',
        ]);
        Notification::assertSentTo(
            $user,
            TicketReplyNotification::class,
            fn (TicketReplyNotification $notification): bool => $notification->ticket->is($ticket),
        );
    }

    public function test_admin_reply_requires_a_message(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);

        $response = $this->withSession(['is_admin' => true])
            ->from(route('admin.tickets.show', $ticket))
            ->post(route('admin.tickets.reply', $ticket), [
                'message' => '',
            ]);

        $response->assertRedirect(route('admin.tickets.show', $ticket))
            ->assertSessionHasErrors(['message']);
        $this->assertDatabaseCount('ticket_replies', 0);
    }

    public function test_admin_cannot_reply_to_a_closed_ticket(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create([
            'subject' => 'Resolved request',
            'status' => 'closed',
        ]);

        $response = $this->withSession(['is_admin' => true])
            ->from(route('admin.tickets.show', $ticket))
            ->post(route('admin.tickets.reply', $ticket), [
                'message' => 'One more question.',
            ]);

        $response->assertRedirect(route('admin.tickets.show', $ticket))
            ->assertSessionHasErrors([
                'message' => 'Ce ticket est fermé et ne peut plus recevoir de réponse.',
            ]);
        $this->assertDatabaseCount('ticket_replies', 0);
    }

    public function test_admin_can_close_a_ticket(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Need help']);

        $response = $this->withSession(['is_admin' => true])
            ->from(route('admin.tickets.show', $ticket))
            ->post(route('admin.tickets.close', $ticket));

        $response->assertRedirect(route('admin.tickets.show', $ticket))
            ->assertSessionHas('success', 'Le ticket a été clôturé.');
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'closed',
        ]);
    }
}
