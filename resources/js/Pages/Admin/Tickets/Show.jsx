import AdminLayout from '@/Layouts/AdminLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function Show({ ticket }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    function replyToTicket(event) {
        event.preventDefault();

        post(route('admin.tickets.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
    }

    function closeTicket() {
        if (window.confirm('Voulez-vous vraiment clôturer ce ticket ?')) {
            router.post(route('admin.tickets.close', ticket.id));
        }
    }

    return (
        <AdminLayout>
            <Head title={`Ticket · ${ticket.subject}`} />

            <div className="px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={route('admin.tickets.index')}
                        className="text-sm font-medium text-zinc-600 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:text-white"
                    >
                        ← Tous les tickets
                    </Link>

                    <header className="mt-7 flex flex-col justify-between gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start dark:border-zinc-800">
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                    {ticket.subject}
                                </h1>
                                <span className="rounded-md border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                                    {ticket.status === 'open' ? 'Ouvert' : 'Fermé'}
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                                {ticket.user?.name ?? 'Utilisateur supprimé'}
                                {ticket.user?.email && (
                                    <span> · {ticket.user.email}</span>
                                )}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                                Créé le {formatDate(ticket.created_at)}
                            </p>
                        </div>

                        {ticket.status === 'open' && (
                            <button
                                type="button"
                                onClick={closeTicket}
                                className="self-start rounded-sm text-sm font-medium text-red-600 underline underline-offset-4 transition hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Clôturer le ticket
                            </button>
                        )}
                    </header>

                    {flash?.success && (
                        <p
                            className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                            role="status"
                        >
                            {flash.success}
                        </p>
                    )}

                    <section
                        aria-label="Conversation"
                        className="flex flex-col gap-5 py-8"
                    >
                        {ticket.replies.map((reply) => {
                            const isSupport = reply.user_id === null;

                            return (
                                <article
                                    key={reply.id}
                                    className={`flex ${
                                        isSupport ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[90%] rounded-md border px-4 py-3 sm:max-w-[75%] ${
                                            isSupport
                                                ? 'border-zinc-300 bg-zinc-100 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white'
                                                : 'border-zinc-200 bg-white text-black dark:border-zinc-800 dark:bg-black dark:text-white'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold">
                                                    {isSupport
                                                        ? 'Support Team'
                                                        : reply.user?.name ??
                                                          'Client'}
                                                </p>
                                                {isSupport && (
                                                    <span className="rounded border border-zinc-400 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-600 dark:text-zinc-300">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <time
                                                dateTime={reply.created_at}
                                                className="text-xs text-zinc-500 dark:text-zinc-400"
                                            >
                                                {formatDate(reply.created_at)}
                                            </time>
                                        </div>
                                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">
                                            {reply.message}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    {ticket.status === 'open' ? (
                        <form
                            onSubmit={replyToTicket}
                            className="border-t border-zinc-200 pt-6 dark:border-zinc-800"
                        >
                            <label
                                htmlFor="admin-reply-message"
                                className="text-sm font-medium"
                            >
                                Réponse du support
                            </label>
                            <textarea
                                id="admin-reply-message"
                                value={data.message}
                                onChange={(event) =>
                                    setData('message', event.target.value)
                                }
                                maxLength={10000}
                                required
                                rows={5}
                                placeholder="Écrivez votre réponse…"
                                className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                            />
                            {errors.message && (
                                <p
                                    className="mt-2 text-sm text-red-700 dark:text-red-300"
                                    role="alert"
                                >
                                    {errors.message}
                                </p>
                            )}
                            <div className="mt-4 flex justify-end">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-3 text-sm normal-case tracking-normal"
                                >
                                    {processing ? 'Envoi…' : 'Répondre'}
                                </PrimaryButton>
                            </div>
                        </form>
                    ) : (
                        <p className="border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                            Ce ticket est fermé. Les nouvelles réponses ne sont
                            plus possibles.
                        </p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
