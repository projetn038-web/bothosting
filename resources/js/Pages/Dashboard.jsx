import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CookieBanner from '@/Components/CookieBanner';
import PlatformIcons from '@/Components/PlatformIcons';
import ThemeToggle from '@/Components/ThemeToggle';

export default function Dashboard({ bots }) {
    const { auth, flash } = usePage().props;
    const {
        post: claimReward,
        processing: claimingReward,
        errors: claimErrors,
    } = useForm({});
    const {
        data: checkoutData,
        setData: setCheckoutData,
        post: buyCoins,
        processing: buyingCoins,
        errors: checkoutErrors,
    } = useForm({
        currency: 'eur',
    });
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
            <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
                <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <Link href="/" className="text-lg font-semibold tracking-tight">
                            Bot<span className="text-zinc-500 dark:text-zinc-400">Hosting</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">
                                {auth.user.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="rounded-md px-3 py-2 text-sm font-semibold text-black transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-white dark:hover:bg-zinc-900"
                            >
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
                    <div className="mb-9">
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                            Votre espace
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Bonjour, {auth.user.name}
                        </h1>
                        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                            Gérez vos récompenses et préparez votre prochain bot.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section
                            aria-labelledby="coins-title"
                            className="relative overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-9"
                        >
                            <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                                <div>
                                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Votre solde
                                    </p>
                                    <div className="mt-3 flex items-center gap-4">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-14 w-14 items-center justify-center rounded-md border border-zinc-200 bg-white text-2xl font-bold text-black dark:border-zinc-800 dark:bg-black dark:text-white"
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
                                            <span className="ml-3 text-xl font-medium text-zinc-500 dark:text-zinc-400">
                                                pièces
                                            </span>
                                        </h2>
                                    </div>
                                    <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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
                                        className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-offset-black"
                                    >
                                        {claimingReward
                                            ? 'Réclamation…'
                                            : 'Réclamer ma récompense'}
                                    </button>
                                    {claimErrors.claim && (
                                        <p
                                            className="max-w-xs text-sm text-zinc-700 dark:text-zinc-300"
                                            role="alert"
                                        >
                                            {claimErrors.claim}
                                        </p>
                                    )}
                                    {flash?.success && (
                                        <p
                                            className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400"
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
                            className="flex flex-col justify-between gap-8 rounded-md border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-9"
                        >
                            <div>
                                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                    Boutique
                                </p>
                                <h2
                                    id="shop-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Besoin de plus de pièces ?
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    Achetez un lot de 1 000 pièces en toute sécurité
                                    avec Stripe Checkout.
                                </p>
                            </div>
                            <form
                                onSubmit={purchaseCoins}
                                className="flex flex-col items-start gap-3"
                            >
                                <label
                                    htmlFor="checkout-currency"
                                    className="flex flex-col gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Devise
                                    <select
                                        id="checkout-currency"
                                        value={checkoutData.currency}
                                        onChange={(event) =>
                                            setCheckoutData(
                                                'currency',
                                                event.target.value,
                                            )
                                        }
                                        className="min-w-48 rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-500"
                                    >
                                        <option value="eur">Euro (€)</option>
                                        <option value="xof">Franc CFA (XOF)</option>
                                    </select>
                                </label>
                                <button
                                    type="submit"
                                    disabled={buyingCoins}
                                    className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-offset-black"
                                >
                                    {buyingCoins
                                        ? 'Redirection vers Stripe…'
                                        : checkoutData.currency === 'xof'
                                          ? 'Acheter 1000 pièces (3500 FCFA)'
                                          : 'Acheter 1000 pièces (5.00€)'}
                                </button>
                                {checkoutErrors.checkout && (
                                    <p
                                        className="max-w-xs text-sm text-zinc-700 dark:text-zinc-300"
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
                        className="mt-8 rounded-md border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-9"
                    >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                            <div>
                                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                    Nouveau projet
                                </p>
                                <h2
                                    id="deploy-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Déployer un nouveau Bot
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    Choisissez un nom et les ressources de départ.
                                </p>
                            </div>
                        </div>

                        <form
                            className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
                            onSubmit={createBot}
                        >
                            <div className="flex flex-col gap-2 md:col-span-3">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Optimisé pour les bots réseaux sociaux
                                </p>
                                <PlatformIcons />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-name"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
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
                                    className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
                                />
                                {errors.name && (
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300" role="alert">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-language"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Langage
                                </label>
                                <select
                                    id="bot-language"
                                    value={data.language}
                                    onChange={(event) =>
                                        setData('language', event.target.value)
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-500"
                                >
                                    <option value="nodejs">Node.js</option>
                                    <option value="python">Python</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="bot-ram"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Mémoire RAM
                                </label>
                                <select
                                    id="bot-ram"
                                    value={data.ram_mb}
                                    onChange={(event) =>
                                        setData('ram_mb', event.target.value)
                                    }
                                    className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-500"
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
                                    className="rounded-md bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-offset-black"
                                >
                                    {processing ? 'Création…' : 'Créer le bot'}
                                </button>
                                {errors.language && (
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300" role="alert">
                                        {errors.language}
                                    </p>
                                )}
                                {errors.ram_mb && (
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300" role="alert">
                                        {errors.ram_mb}
                                    </p>
                                )}
                            </div>
                        </form>
                    </section>

                    <section
                        aria-labelledby="bots-title"
                        className="mt-8 rounded-md border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950 sm:p-9"
                    >
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                                    Vos déploiements
                                </p>
                                <h2
                                    id="bots-title"
                                    className="mt-2 text-2xl font-semibold tracking-tight"
                                >
                                    Mes bots
                                </h2>
                            </div>
                            <span className="rounded-md border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                                {bots.length}
                            </span>
                        </div>

                        {bots.length === 0 ? (
                            <p className="mt-6 rounded-md border border-dashed border-zinc-300 px-5 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                                Aucun bot pour le moment. Créez votre premier bot ci-dessus.
                            </p>
                        ) : (
                            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                                {bots.map((bot) => (
                                    <article
                                        key={bot.id}
                                        className="rounded-md border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate text-base font-semibold">
                                                    {bot.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                    {bot.language === 'nodejs'
                                                        ? 'Node.js'
                                                        : 'Python'}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-semibold dark:border-zinc-800 ${
                                                    bot.status === 'active'
                                                        ? 'text-zinc-800 dark:text-zinc-200'
                                                        : 'text-zinc-500 dark:text-zinc-500'
                                                }`}
                                            >
                                                {bot.status === 'active'
                                                    ? 'Actif'
                                                    : 'Suspendu'}
                                            </span>
                                        </div>
                                        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
                                            <div>
                                                <dt className="text-zinc-500 dark:text-zinc-400">
                                                    RAM
                                                </dt>
                                                <dd className="mt-1 font-medium">
                                                    {bot.ram_mb >= 1024
                                                        ? `${bot.ram_mb / 1024} GB`
                                                        : `${bot.ram_mb} MB`}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-zinc-500 dark:text-zinc-400">
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
            <CookieBanner />
        </>
    );
}
