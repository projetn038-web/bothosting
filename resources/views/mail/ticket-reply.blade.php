<x-mail::message>
# Réponse du support

Le support a répondu à votre ticket : **{{ $ticketSubject }}**.

<x-mail::button :url="$ticketUrl" color="primary">
Voir la réponse
</x-mail::button>

À bientôt,<br>
{{ config('app.name') }}
</x-mail::message>
