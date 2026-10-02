<x-mail::message>
# Suspension de votre bot

Votre bot **{{ $serverName }}** a été suspendu par manque de pièces. Rechargez votre compte pour le réactiver.

<x-mail::button :url="$dashboardUrl" color="primary">
Accéder au dashboard
</x-mail::button>

À bientôt,<br>
{{ config('app.name') }}
</x-mail::message>
