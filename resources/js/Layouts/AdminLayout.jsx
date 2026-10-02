import CookieBanner from '@/Components/CookieBanner';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    return (
        <>
            <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
                <header className="border-b border-zinc-200 dark:border-zinc-800">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <Link
                            href={route('admin.dashboard')}
                            className="text-sm font-semibold tracking-tight"
                        >
                            Admin Panel
                        </Link>
                        <nav
                            aria-label="Administration"
                            className="flex flex-wrap items-center justify-end gap-1 sm:gap-4"
                        >
                            <Link
                                href={route('admin.dashboard')}
                                className="rounded-sm px-2 py-2 text-sm text-zinc-600 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:text-white"
                            >
                                Tableau de bord
                            </Link>
                            <Link
                                href={route('admin.tickets.index')}
                                className="rounded-sm px-2 py-2 text-sm font-medium transition hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:text-zinc-300"
                            >
                                Tickets
                            </Link>
                            <Link
                                href={route('admin.users.index')}
                                className="rounded-sm px-2 py-2 text-sm font-medium transition hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:text-zinc-300"
                            >
                                Utilisateurs
                            </Link>
                            <Link
                                href={route('admin.logs.index')}
                                className="rounded-sm px-2 py-2 text-sm font-medium transition hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:text-zinc-300"
                            >
                                Logs Système
                            </Link>
                            <ThemeToggle />
                        </nav>
                    </div>
                </header>
                {children}
            </main>
            <CookieBanner />
        </>
    );
}
