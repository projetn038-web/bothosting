const providers = [
    {
        id: 'google',
        label: 'Continuer avec Google',
        icon: (
            <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
            >
                <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                />
                <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.47-4.76 7.16l7.98 6.19c4.66-4.31 6.86-10.66 6.86-17.82Z"
                />
                <path
                    fill="#FBBC05"
                    d="M10.54 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.98-6.19Z"
                />
                <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.9-5.78l-7.98-6.19c-2.21 1.48-5.04 2.36-7.92 2.36-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
            </svg>
        ),
    },
    {
        id: 'github',
        label: 'Continuer avec GitHub',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current"
                aria-hidden="true"
            >
                <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.23-1.65-1.23-1.65-1.01-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.04-1.14 3.04-1.14.61 1.53.23 2.67.12 2.95.71.78 1.14 1.77 1.14 2.99 0 4.3-2.61 5.24-5.1 5.52.4.35.75 1.02.75 2.06v3.12c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
        ),
    },
];

export default function SocialAuthButtons() {
    return (
        <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    ou continuer avec
                </span>
                <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            </div>

            <div className="flex flex-col gap-3">
                {providers.map((provider) => (
                    <a
                        key={provider.id}
                        href={`/auth/${provider.id}/redirect`}
                        className="relative flex w-full items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-black dark:text-white dark:hover:bg-zinc-900 dark:focus:ring-offset-zinc-950"
                    >
                        <span className="absolute left-4">{provider.icon}</span>
                        <span>{provider.label}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
