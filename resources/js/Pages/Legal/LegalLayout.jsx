import CookieBanner from '@/Components/CookieBanner';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';

export default function LegalLayout({ title, children }) {
    return (
        <>
            <Head title={title} />
            <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/[0.08] dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            Bot<span className="text-cyan-600 dark:text-cyan-300">Hosting</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-600 transition hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300"
                            >
                                Accueil
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-slate-900 sm:p-10">
                        {children}
                    </article>
                    <footer className="flex flex-wrap gap-x-6 gap-y-3 py-8 text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/cgu" className="hover:text-cyan-700 dark:hover:text-cyan-300">
                            Conditions générales
                        </Link>
                        <Link href="/rgpd" className="hover:text-cyan-700 dark:hover:text-cyan-300">
                            Confidentialité
                        </Link>
                        <Link href="/" className="hover:text-cyan-700 dark:hover:text-cyan-300">
                            Retour à l’accueil
                        </Link>
                    </footer>
                </div>
            </main>
            <CookieBanner />
        </>
    );
}
