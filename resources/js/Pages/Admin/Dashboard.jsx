import ThemeToggle from '@/Components/ThemeToggle';
import CookieBanner from '@/Components/CookieBanner';
import { Head, Link } from '@inertiajs/react';

function UsersIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm2 4a4 4 0 0 1 4 4v2m-3-14a4 4 0 0 1 0 8"
            />
        </svg>
    );
}

function ServerIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <rect x="3" y="4" width="18" height="7" rx="2" />
            <rect x="3" y="13" width="18" height="7" rx="2" />
            <path strokeLinecap="round" d="M7 7.5h.01M7 16.5h.01M11 7.5h6M11 16.5h6" />
        </svg>
    );
}

function CoinIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"
            />
        </svg>
    );
}

function StatCard({ label, value, icon, accent }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                        {value}
                    </p>
                </div>
                <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent}`}
                >
                    {icon}
                </span>
            </div>
        </article>
    );
}

function StatusBadge({ status }) {
    const isActive = status === 'active';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300'
            }`}
        >
            <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
            />
            {isActive ? 'Actif' : 'Suspendu'}
        </span>
    );
}

function formatRam(ramMb) {
    return ramMb >= 1024 ? `${ramMb / 1024} GB` : `${ramMb} MB`;
}

export default function AdminDashboard({ stats, servers }) {
    const statCards = [
        {
            label: 'Total utilisateurs',
            value: Number(stats.users).toLocaleString('fr-FR'),
            icon: <UsersIcon />,
            accent: 'bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
        },
        {
            label: 'Total bots',
            value: Number(stats.bots).toLocaleString('fr-FR'),
            icon: <ServerIcon />,
            accent: 'bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300',
        },
        {
            label: 'Pièces en circulation',
            value: Number(stats.coins).toLocaleString('fr-FR'),
            icon: <CoinIcon />,
            accent: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
        },
    ];

    return (
        <>
            <Head title="Administration" />
            <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#080d19] dark:text-white">
                <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-white/[0.07] dark:bg-slate-950/90">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-950/20">
                                <ServerIcon />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold tracking-tight sm:text-base">
                                    Admin Panel
                                </p>
                                <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                                    BotHosting · Vue d’ensemble
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <Link
                                href={route('admin.tickets.index')}
                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-4"
                            >
                                Tickets
                            </Link>
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-4"
                            >
                                Utilisateurs
                            </Link>
                            <Link
                                href={route('admin.logs.index')}
                                className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-4"
                            >
                                Logs Système
                            </Link>
                            <ThemeToggle />
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:px-4"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m15 18-6-6 6-6M9 12h12"
                                    />
                                </svg>
                                <span className="hidden sm:inline">
                                    Retour à l’accueil
                                </span>
                                <span className="sm:hidden">Accueil</span>
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <section>
                        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                            Administration
                        </p>
                        <div className="mt-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    Vue d’ensemble
                                </h1>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    Suivez l’activité et les ressources de la plateforme.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section
                        aria-label="Statistiques globales"
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {statCards.map((card) => (
                            <StatCard key={card.label} {...card} />
                        ))}
                    </section>

                    <section
                        aria-labelledby="servers-heading"
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                        <div className="flex flex-col gap-1 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
                            <h2
                                id="servers-heading"
                                className="text-lg font-semibold tracking-tight"
                            >
                                Tous les bots
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {servers.length.toLocaleString('fr-FR')} serveur
                                {servers.length === 1 ? '' : 's'} sur la plateforme
                            </p>
                        </div>

                        {servers.length === 0 ? (
                            <div className="px-5 py-14 text-center sm:px-6">
                                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                    <ServerIcon />
                                </span>
                                <h3 className="mt-4 text-sm font-semibold">
                                    Aucun bot déployé
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Les serveurs créés apparaîtront ici.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                                    {servers.map((server) => (
                                        <article
                                            key={server.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-gray-800"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold">
                                                        {server.name}
                                                    </h3>
                                                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-300">
                                                        {server.user?.name ??
                                                            'Utilisateur supprimé'}
                                                    </p>
                                                </div>
                                                <StatusBadge status={server.status} />
                                            </div>
                                            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-sm dark:border-slate-700">
                                                <div>
                                                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                                                        RAM
                                                    </dt>
                                                    <dd className="mt-1 font-medium">
                                                        {formatRam(server.ram_mb)}
                                                    </dd>
                                                </div>
                                                <div className="text-right">
                                                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                                                        Actions
                                                    </dt>
                                                    <dd className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                        Aucune action disponible
                                                    </dd>
                                                </div>
                                            </dl>
                                        </article>
                                    ))}
                                </div>

                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full min-w-[680px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3.5 font-semibold">
                                                    Bot
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 font-semibold">
                                                    Propriétaire
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 font-semibold">
                                                    RAM
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 font-semibold">
                                                    Statut
                                                </th>
                                                <th scope="col" className="px-6 py-3.5 text-right font-semibold">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {servers.map((server) => (
                                                <tr
                                                    key={server.id}
                                                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-slate-900 dark:text-white">
                                                            {server.name}
                                                        </div>
                                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                            {server.language === 'nodejs'
                                                                ? 'Node.js'
                                                                : 'Python'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">
                                                            {server.user?.name ??
                                                                'Utilisateur supprimé'}
                                                        </div>
                                                        {server.user?.email && (
                                                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                                {server.user.email}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                                                        {formatRam(server.ram_mb)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <StatusBadge status={server.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-xs text-slate-500 dark:text-slate-400">
                                                        Aucune action disponible
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>
            <CookieBanner />
        </>
    );
}
