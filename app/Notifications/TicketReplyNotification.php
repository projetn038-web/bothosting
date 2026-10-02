<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class TicketReplyNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Ticket $ticket) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle réponse à votre ticket')
            ->markdown('mail.ticket-reply', [
                'ticketSubject' => $this->ticket->subject,
                'ticketUrl' => route('support.show', $this->ticket),
            ]);
    }
}
