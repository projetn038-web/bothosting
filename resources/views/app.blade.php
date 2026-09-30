<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <script>
            (() => {
                try {
                    const storedTheme = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
                    document.documentElement.classList.toggle(
                        'dark',
                        storedTheme === 'dark' || (storedTheme !== 'light' && prefersDark),
                    );
                } catch {
                    document.documentElement.classList.toggle(
                        'dark',
                        window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false,
                    );
                }
            })();
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="bg-white font-sans antialiased text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        @inertia
    </body>
</html>
