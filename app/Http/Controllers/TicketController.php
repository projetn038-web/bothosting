<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Support/Index', [
            'tickets' => $request->user()->tickets()->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:10000'],
        ]);
        $user = $request->user();

        $ticket = DB::transaction(function () use ($user, $validated): Ticket {
            $ticket = $user->tickets()->create([
                'subject' => $validated['subject'],
                'status' => 'open',
            ]);

            $ticket->replies()->create([
                'user_id' => $user->getKey(),
                'message' => $validated['message'],
            ]);

            return $ticket;
        });

        return redirect()
            ->route('support.show', $ticket)
            ->with('success', 'Votre ticket a été créé.');
    }

    public function show(Request $request, int $ticket): Response
    {
        $ticket = $request->user()
            ->tickets()
            ->with('replies.user')
            ->findOrFail($ticket);

        return Inertia::render('Support/Show', [
            'ticket' => $ticket,
        ]);
    }

    public function reply(Request $request, int $ticket): RedirectResponse
    {
        $ticket = $request->user()->tickets()->findOrFail($ticket);

        if ($ticket->status === 'closed') {
            return back()->withErrors([
                'message' => 'Ce ticket est fermé et ne peut plus recevoir de réponse.',
            ]);
        }

        $validated = $request->validate([
            'message' => ['required', 'string', 'max:10000'],
        ]);

        $ticket->replies()->create([
            'user_id' => $request->user()->getKey(),
            'message' => $validated['message'],
        ]);

        return back()->with('success', 'Votre réponse a été envoyée.');
    }
}
