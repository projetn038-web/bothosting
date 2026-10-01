import ThemeToggle from '@/Components/ThemeToggle';
import CookieBanner from '@/Components/CookieBanner';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white px-4 py-6 text-black dark:bg-black dark:text-white sm:justify-center sm:py-10">
            <div className="flex w-full max-w-md items-center justify-between gap-4 sm:mb-4">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-black dark:text-white"
                >
                    Bot<span className="text-zinc-500 dark:text-zinc-400">Hosting</span>
                </Link>
                <ThemeToggle />
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950 sm:mt-0 sm:max-w-md sm:px-8">
                {children}
            </div>
            <CookieBanner />
        </div>
    );
}
