import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:justify-center sm:py-10">
            <div className="flex w-full max-w-md items-center justify-between gap-4 sm:mb-4">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
                >
                    Bot<span className="text-cyan-600 dark:text-cyan-300">Hosting</span>
                </Link>
                <ThemeToggle />
            </div>

            <div className="mt-6 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-md dark:border-gray-800 dark:bg-gray-900 sm:mt-0 sm:max-w-md sm:px-8">
                {children}
            </div>
        </div>
    );
}
