<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ServerSuspendedNotification;
use App\Notifications\TicketReplyNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionalNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_server_suspension_email_contains_the_bot_name_and_dashboard_link(): void
    {
        $user = User::factory()->make();
        $mail = (new ServerSuspendedNotification('Production bot'))->toMail($user);

        $html = (string) $mail->render();

        $this->assertStringContainsString(
            'Production bot',
            $html,
        );
        $this->assertStringContainsString(
            'a été suspendu par manque de pièces. Rechargez votre compte pour le réactiver.',
            $html,
        );
        $this->assertStringContainsString(route('dashboard'), $html);
        $this->assertStringContainsString('Accéder au dashboard', $html);
    }

    public function test_ticket_reply_email_contains_the_ticket_subject_and_conversation_link(): void
    {
        $user = User::factory()->create();
        $ticket = $user->tickets()->create(['subject' => 'Bot deployment']);
        $mail = (new TicketReplyNotification($ticket))->toMail($user);

        $html = (string) $mail->render();

        $this->assertStringContainsString(
            'Le support a répondu à votre ticket :',
            $html,
        );
        $this->assertStringContainsString('Bot deployment', $html);
        $this->assertStringContainsString('/support/tickets/'.$ticket->id, $html);
        $this->assertStringContainsString('Voir la réponse', $html);
    }
}
