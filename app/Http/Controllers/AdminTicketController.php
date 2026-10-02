<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTicketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => Ticket::with('user')
                ->orderByRaw("status = 'open' DESC")
                ->latest()
                ->get(),
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load(['user', 'replies.user']);

        return Inertia::render('Admin/Tickets/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, Ticket $ticket): RedirectResponse
    {
        if ($ticket->status === 'closed') {
            return back()->withErrors([
                'message' => 'Ce ticket est fermé et ne peut plus recevoir de réponse.',
            ]);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:10000'],
        ]);

        $ticket->replies()->create([
            'user_id' => null,
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Votre réponse a été envoyée.');
    }

    public function close(Ticket $ticket): RedirectResponse
    {
        $ticket->update(['status' => 'closed']);

        return back()->with('success', 'Le ticket a été clôturé.');
    }
}
