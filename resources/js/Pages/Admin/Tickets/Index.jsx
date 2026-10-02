import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

function StatusBadge({ status }) {
    const isOpen = status === 'open';

    return (
        <span
            className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                isOpen
                    ? 'border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'
                    : 'border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400'
            }`}
        >
            {isOpen ? 'Ouvert' : 'Fermé'}
        </span>
    );
}

export default function Index({ tickets }) {
    return (
        <AdminLayout>
            <Head title="Gestion des tickets" />

            <div className="px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto max-w-7xl">
                    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Administration
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                                Tickets de support
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {tickets.length} ticket{tickets.length === 1 ? '' : 's'}
                        </p>
                    </header>

                    <section
                        aria-label="Tous les tickets"
                        className="mt-8 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800"
                    >
                        {tickets.length === 0 ? (
                            <p className="px-6 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
                                Aucun ticket pour le moment.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] text-left text-sm">
                                    <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 font-medium"
                                            >
                                                ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 font-medium"
                                            >
                                                Utilisateur
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 font-medium"
                                            >
                                                Sujet
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 font-medium"
                                            >
                                                Statut
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-5 py-4 font-medium"
                                            >
                                                Date
                                            </th>
                                            <th scope="col" className="px-5 py-4">
                                                <span className="sr-only">Action</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {tickets.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-950"
                                            >
                                                <td className="whitespace-nowrap px-5 py-4 text-zinc-500 dark:text-zinc-400">
                                                    #{ticket.id}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-medium">
                                                        {ticket.user?.name ??
                                                            'Utilisateur supprimé'}
                                                    </div>
                                                    {ticket.user?.email && (
                                                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                            {ticket.user.email}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 font-medium">
                                                    {ticket.subject}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <StatusBadge
                                                        status={ticket.status}
                                                    />
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-zinc-500 dark:text-zinc-400">
                                                    {formatDate(ticket.created_at)}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'admin.tickets.show',
                                                            ticket.id,
                                                        )}
                                                        className="rounded-sm text-sm font-medium underline underline-offset-4 transition hover:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:hover:text-zinc-300"
                                                    >
                                                        Ouvrir
                                                    </Link>
                                                </td>
                                            </tr>
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
