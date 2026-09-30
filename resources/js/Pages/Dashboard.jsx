import { Head, Link, useForm, usePage } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Dashboard({ bots }) {
    const { auth, flash } = usePage().props;
    const {
        post: claimReward,
        processing: claimingReward,
        errors: claimErrors,
    } = useForm({});
    const {
        post: buyCoins,
        processing: buyingCoins,
        errors: checkoutErrors,
    } = useForm({});
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        name: '',
        language: 'nodejs',
        ram_mb: '512',
    });

    function claimDailyReward(event) {
        event.preventDefault();
        claimReward('/coins/claim');
    }

    function purchaseCoins(event) {
        event.preventDefault();
        buyCoins('/buy-coins');
    }

    function createBot(event) {
        event.preventDefault();
        post('/bots', {
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title="Dashboard" />
            <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-[#080d19] dark:text-white">
                <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-white/[0.07] dark:bg-slate-950/70">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            Bot<span className="text-cyan-500 dark:text-cyan-300">Hosting</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <span className="hidden text-sm text-slate-500 sm:inline dark:text-slate-400">
                                {auth.user.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                            >
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                    <div className="mb-9">
                        <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                            Votre espace
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Bonjour, {auth.user.name}
                        </h1>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Gérez vos récompenses et préparez votre prochain bot.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section
                            aria-labelledby="coins-title"
                            className="relative overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-br from-white via-cyan-50 to-sky-100 p-6 shadow-sm dark:border-cyan-300/15 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/50 sm:p-9"
                        >
                            <div
                                aria-hidden="true"
                                className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-300/10"
                            />
                            <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        Votre solde
                                    </p>
                                    <div className="mt-3 flex items-center gap-4">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-2xl font-bold text-amber-950 shadow-lg shadow-amber-950/10"
                                        >
                                            $
                                        </span>
                                        <h2
                                            id="coins-title"
                                            className="text-5xl font-semibold tracking-tight sm:text-6xl"
                                        >
                                            {Number(auth.user.coins ?? 0).toLocaleString(
                                                'fr-FR',
                                            )}
                                            <span className="ml-3 text-xl font-medium text-slate-500 dark:text-slate-400">
                                                pièces
                                            </span>
                                        </h2>
                                    </div>
                                    <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
                                        Revenez chaque jour pour récupérer votre récompense.
                                    </p>
                                </div>

                                <form
                                    onSubmit={claimDailyReward}
                                    className="flex shrink-0 flex-col gap-3 sm:items-end"
                                >
                                    <button
                                        type="submit"
                                        disabled={claimingReward}
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200 dark:focus:ring-offset-slate-900"
                                    >
                                        {claimingReward
                                            ? 'Réclamation…'
                                            : 'Réclamer ma récompense'}
                                    </button>
                                    {claimErrors.claim && (
                                        <p
                                            className="max-w-xs text-sm text-rose-600 dark:text-rose-300"
                                            role="alert"
                                        >
                                            {claimErrors.claim}
                                        </p>
                                    )}
                                    {flash?.success && (
                                        <p
                                            className="max-w-xs text-sm text-emerald-700 dark:text-emerald-300"
                                            role="status"
                                        >
                                            {flash.success}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </section>

                        <section
                            aria-labelledby="shop-title"
                            className="flex flex-col justify-between gap-8 rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-6 shadow-sm dark:border-amber-300/15 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 sm:p-9"
                        >
                            <div>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                                    Boutique
                                </p>
                                <h2
                                    id="shop-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Besoin de plus de pièces ?
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    Achetez un lot de 1 000 pièces en toute sécurité
                                    avec Stripe Checkout.
                                </p>
                            </div>
                            <form
                                onSubmit={purchaseCoins}
                                className="flex flex-col items-start gap-3"
                            >
                                <button
                                    type="submit"
                                    disabled={buyingCoins}
                                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-semibold text-amber-950 shadow-lg transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-300 dark:hover:bg-amber-200 dark:focus:ring-offset-slate-900"
                                >
                                    {buyingCoins
                                        ? 'Redirection vers Stripe…'
                                        : 'Acheter 1000 pièces (5.00€)'}
                                </button>
                                {checkoutErrors.checkout && (
                                    <p
                                        className="max-w-xs text-sm text-rose-600 dark:text-rose-300"
                                        role="alert"
                                    >
                                        {checkoutErrors.checkout}
                                    </p>
                                )}
                            </form>
                        </section>
                    </div>

                    <section
                        aria-labelledby="deploy-title"
                        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-slate-900/70 sm:p-9"
                    >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                                    Nouveau projet
                                </p>
                                <h2
                                    id="deploy-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Déployer un nouveau Bot
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                                    Choisissez un nom et les ressources de départ.
                                </p>
                            </div>
                        </div>

                        <form
                            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
                            onSubmit={createBot}
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-name"
                                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Nom du bot
                                </label>
                                <input
                                    id="bot-name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    maxLength={255}
                                    required
                                    placeholder="Mon nouveau bot"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300"
                                />
                                {errors.name && (
                                    <p className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-language"
                                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Langage
                                </label>
                                <select
                                    id="bot-language"
                                    value={data.language}
                                    onChange={(event) =>
                                        setData('language', event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300"
                                >
                                    <option value="nodejs">Node.js</option>
                                    <option value="python">Python</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-ram"
                                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                                >
                                    Mémoire RAM
                                </label>
                                <select
                                    id="bot-ram"
                                    value={data.ram_mb}
                                    onChange={(event) =>
                                        setData('ram_mb', event.target.value)
                                    }
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-cyan-300"
                                >
                                    <option value="512">512 MB</option>
                                    <option value="1024">1 GB</option>
                                    <option value="2048">2 GB</option>
                                </select>
                            </div>
                            <div className="md:col-span-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200 dark:focus:ring-offset-slate-900"
                                >
                                    {processing ? 'Création…' : 'Créer le bot'}
                                </button>
                                {errors.language && (
                                    <p className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                                        {errors.language}
                                    </p>
                                )}
                                {errors.ram_mb && (
                                    <p className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                                        {errors.ram_mb}
                                    </p>
                                )}
                            </div>
                        </form>
                    </section>

                    <section
                        aria-labelledby="bots-title"
                        className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-slate-900/70 sm:p-9"
                    >
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                                    Vos déploiements
                                </p>
                                <h2
                                    id="bots-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Mes bots
                                </h2>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
                                {bots.length}
                            </span>
                        </div>

                        {bots.length === 0 ? (
                            <p className="mt-6 rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                Aucun bot pour le moment. Créez votre premier bot ci-dessus.
                            </p>
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {bots.map((bot) => (
                                    <article
                                        key={bot.id}
                                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-base font-semibold">
                                                    {bot.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    {bot.language === 'nodejs'
                                                        ? 'Node.js'
                                                        : 'Python'}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    bot.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300'
                                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300'
                                                }`}
                                            >
                                                {bot.status === 'active'
                                                    ? 'Actif'
                                                    : 'Suspendu'}
                                            </span>
                                        </div>
                                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-sm dark:border-white/[0.06]">
                                            <div>
                                                <dt className="text-slate-500 dark:text-slate-400">
                                                    RAM
                                                </dt>
                                                <dd className="mt-1 font-medium">
                                                    {bot.ram_mb >= 1024
                                                        ? `${bot.ram_mb / 1024} GB`
                                                        : `${bot.ram_mb} MB`}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500 dark:text-slate-400">
                                                    Coût horaire
                                                </dt>
                                                <dd className="mt-1 font-medium">
                                                    {bot.cost_per_hour} pièces/h
                                                </dd>
                                            </div>
                                        </dl>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}
