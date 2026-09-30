import { Head, Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Welcome() {
    return (
        <>
            <Head title="Hébergement de Bots" />
            <main className="relative isolate flex min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute -left-40 top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/15" />
                    <div className="absolute -right-40 bottom-[-14rem] h-[36rem] w-[36rem] rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]" />
                </div>

                <div className="mx-auto flex w-full max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
                    <header className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="text-lg font-semibold tracking-tight"
                        >
                            Bot<span className="text-cyan-300">Hosting</span>
                        </Link>
                        <nav className="flex items-center gap-2 sm:gap-3">
                            <ThemeToggle />
                            <Link
                                href="/login"
                                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-slate-300 dark:hover:text-white sm:px-4"
                            >
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-black/10 transition hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-50 dark:border-white/10 dark:hover:bg-cyan-100 dark:focus:ring-cyan-300 dark:focus:ring-offset-slate-950 sm:px-4"
                            >
                                Inscription
                            </Link>
                        </nav>
                    </header>

                    <section className="flex flex-1 items-center py-20 sm:py-28">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-700/15 bg-cyan-100 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-800 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                                Simple. Rapide. Fiable.
                            </div>
                            <h1 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                                Hébergement de Bots
                                <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                    sans prise de tête.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
                                Déployez et gérez vos bots en quelques instants.
                                Choisissez vos ressources, gardez le contrôle et
                                laissez votre projet tourner en toute sérénité.
                            </p>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-xl bg-cyan-300 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-950/30 transition hover:bg-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.08] dark:focus:ring-cyan-300"
                                >
                                    Inscription
                                </Link>
                            </div>
                            <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-2">
                                    <span className="text-cyan-700 dark:text-cyan-300">✓</span>
                                    Configuration en quelques clics
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="text-cyan-700 dark:text-cyan-300">✓</span>
                                    Ressources adaptées à vos besoins
                                </span>
                            </div>
                        </div>
                    </section>

                    <footer className="border-t border-slate-200 py-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-500">
                        Votre bot, prêt à démarrer.
                    </footer>
                </div>
            </main>
        </>
    );
}
