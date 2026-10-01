import CookieBanner from '@/Components/CookieBanner';
import PlatformIcons from '@/Components/PlatformIcons';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link, usePage } from '@inertiajs/react';

const features = [
    {
        number: '01',
        title: 'Haute disponibilité',
        description:
            'Gardez vos projets en ligne 24/7 et suivez leur statut depuis un espace de gestion unique.',
        icon: (
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Node.js et Python',
        description:
            'Choisissez le langage de votre bot et ses ressources en quelques clics, sans gérer vous-même l’infrastructure.',
        icon: (
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-10-2 12" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Une économie de pièces',
        description:
            'Réclamez des pièces gratuites chaque jour et utilisez-les pour faire fonctionner vos bots.',
        icon: (
            <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <ellipse cx="12" cy="6" rx="8" ry="3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
            </svg>
        ),
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const isAuthenticated = Boolean(auth?.user);

    return (
        <>
            <Head title="Hébergez vos Bots 24/7" />
            <main className="relative isolate min-h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] dark:bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]" />
                </div>

                <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
                    <header className="flex items-center justify-between gap-4">
                        <Link href="/" className="text-sm font-semibold tracking-tight sm:text-lg">
                            Bot<span className="text-zinc-500 dark:text-zinc-400">Hosting</span>
                        </Link>
                        <nav aria-label="Navigation principale" className="flex items-center gap-0.5 sm:gap-3">
                            <PlatformIcons />
                            <ThemeToggle />
                            {isAuthenticated ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-md border border-zinc-200 bg-black px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:px-4"
                                >
                                    Mon espace
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="rounded-md px-0 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white sm:px-4 sm:text-sm">
                                        Connexion
                                    </Link>
                                    <Link href="/register" className="rounded-md border border-zinc-200 bg-black px-1 py-2.5 text-xs font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:px-4 sm:text-sm">
                                        Inscription
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <section className="flex flex-1 items-center py-24 sm:py-32">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                                <span className="h-1.5 w-1.5 rounded-md bg-zinc-500 dark:bg-zinc-400" />
                                Simple. Rapide. Fiable.
                            </div>
                            <h1 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                                Hébergez vos Bots
                                <span className="mt-2 block text-zinc-500 dark:text-zinc-400">
                                    24/7, sans prise de tête.
                                </span>
                            </h1>
                            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
                                Déployez vos bots Node.js ou Python et laissez-les tourner en continu.
                                Récupérez des pièces gratuites chaque jour pour démarrer.
                            </p>
                            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={isAuthenticated ? '/dashboard' : '/register'}
                                    className="inline-flex items-center justify-center rounded-md bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-offset-black"
                                >
                                    {isAuthenticated ? 'Accéder au tableau de bord' : 'Commencer gratuitement'}
                                </Link>
                                {!isAuthenticated && (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:border-zinc-500 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-black dark:text-white dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                                    >
                                        Déjà un compte ? Connexion
                                    </Link>
                                )}
                            </div>
                            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <span className="flex items-center gap-2">
                                    <span className="text-zinc-700 dark:text-zinc-300">✓</span>
                                    Configuration en quelques clics
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="text-zinc-700 dark:text-zinc-300">✓</span>
                                    Ressources adaptées à vos besoins
                                </span>
                            </div>
                        </div>
                    </section>

                    <section aria-labelledby="features-title" className="pb-20 sm:pb-24">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                Tout ce qu’il faut pour démarrer
                            </p>
                            <h2 id="features-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Votre bot, votre façon.
                            </h2>
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
                            {features.map((feature) => (
                                <article
                                    key={feature.number}
                                    className="rounded-md border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200">
                                            {feature.icon}
                                        </span>
                                        <span className="text-sm font-semibold text-zinc-400 dark:text-zinc-600">
                                            {feature.number}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                        {feature.description}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <footer className="flex flex-col gap-4 border-t border-zinc-200 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
                        <p>© {new Date().getFullYear()} BotHosting. Votre bot, prêt à démarrer.</p>
                        <nav aria-label="Liens de pied de page" className="flex flex-wrap gap-x-5 gap-y-2">
                            {isAuthenticated ? (
                                <Link href="/dashboard" className="transition hover:text-black dark:hover:text-white">
                                    Mon espace
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="transition hover:text-black dark:hover:text-white">
                                        Connexion
                                    </Link>
                                    <Link href="/register" className="transition hover:text-black dark:hover:text-white">
                                        Inscription
                                    </Link>
                                </>
                            )}
                            <Link href="/cgu" className="transition hover:text-black dark:hover:text-white">
                                CGU
                            </Link>
                            <Link href="/rgpd" className="transition hover:text-black dark:hover:text-white">
                                RGPD
                            </Link>
                        </nav>
                    </footer>
                </div>
            </main>
            <CookieBanner />
        </>
    );
}
