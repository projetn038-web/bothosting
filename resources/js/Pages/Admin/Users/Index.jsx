import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';

function formatDate(date) {
    if (!date) {
        return 'Jamais';
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

function UserRow({ user }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
    });

    function updateCoins(event) {
        event.preventDefault();

        post(route('admin.users.coins', user.id), {
            onSuccess: () => reset('amount'),
        });
    }

    function toggleBan() {
        router.post(route('admin.users.toggle-ban', user.id));
    }

    return (
        <tr className="align-top transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950">
            <td className="px-5 py-4">
                <p className="font-medium">{user.name}</p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                </p>
            </td>
            <td className="whitespace-nowrap px-5 py-4 font-medium">
                {Number(user.coins).toLocaleString('fr-FR')}
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-zinc-600 dark:text-zinc-400">
                {user.last_login_ip ?? '—'}
            </td>
            <td className="whitespace-nowrap px-5 py-4 text-zinc-600 dark:text-zinc-400">
                {formatDate(user.last_login_at)}
            </td>
            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                        user.is_banned
                            ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
                            : 'border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300'
                    }`}
                >
                    {user.is_banned ? 'Banni' : 'Actif'}
                </span>
            </td>
            <td className="px-5 py-4 text-center">{user.bot_servers_count}</td>
            <td className="px-5 py-4">
                <div className="flex min-w-44 flex-col gap-3">
                    <button
                        type="button"
                        onClick={toggleBan}
                        className={`self-start rounded-sm text-sm font-medium underline underline-offset-4 focus:outline-none focus:ring-2 ${
                            user.is_banned
                                ? 'text-emerald-700 hover:text-emerald-800 focus:ring-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300'
                                : 'text-red-600 hover:text-red-700 focus:ring-red-500 dark:text-red-400 dark:hover:text-red-300'
                        }`}
                    >
                        {user.is_banned ? 'Débannir' : 'Bannir'}
                    </button>
                    <form onSubmit={updateCoins} className="flex items-start gap-2">
                        <div>
                            <label
                                htmlFor={`coins-${user.id}`}
                                className="sr-only"
                            >
                                Variation du solde de {user.name}
                            </label>
                            <input
                                id={`coins-${user.id}`}
                                type="number"
                                step="1"
                                min="-2147483647"
                                max="2147483647"
                                required
                                value={data.amount}
                                onChange={(event) =>
                                    setData('amount', event.target.value)
                                }
                                placeholder="+/- pièces"
                                className="w-28 rounded-md border border-zinc-300 bg-white px-2.5 py-2 text-sm text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white"
                            />
                            {errors.amount && (
                                <p
                                    className="mt-1 max-w-40 text-xs text-red-600 dark:text-red-400"
                                    role="alert"
                                >
                                    {errors.amount}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md border border-zinc-300 px-3 py-2 text-xs font-medium transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                        >
                            Modifier
                        </button>
                    </form>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ users }) {
    const { flash } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Gestion des utilisateurs" />

            <div className="px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto max-w-7xl">
                    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Administration
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                Utilisateurs
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {users.length} utilisateur{users.length === 1 ? '' : 's'}
                        </p>
                    </header>

                    {flash?.success && (
                        <p
                            className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                            role="status"
                        >
                            {flash.success}
                        </p>
                    )}

                    <section
                        aria-label="Tous les utilisateurs"
                        className="mt-8 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800"
                    >
                        {users.length === 0 ? (
                            <p className="px-6 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                Aucun utilisateur pour le moment.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1100px] text-left text-sm">
                                    <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                                        <tr>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Utilisateur
                                            </th>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Pièces
                                            </th>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Dernière IP
                                            </th>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Dernière connexion
                                            </th>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Statut
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 text-center font-medium"
                                            >
                                                Bots
                                            </th>
                                            <th scope="col" className="px-5 py-4 font-medium">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {users.map((user) => (
                                            <UserRow key={user.id} user={user} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
