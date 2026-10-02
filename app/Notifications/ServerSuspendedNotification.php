<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;

class ServerSuspendedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public readonly string $serverName) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre bot a été suspendu')
            ->markdown('mail.server-suspended', [
                'serverName' => $this->serverName,
                'dashboardUrl' => route('dashboard'),
            ]);
    }
}
