import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function Show({ ticket }) {
    const { auth, flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    function replyToTicket(event) {
        event.preventDefault();

        post(route('support.reply', ticket.id), {
            onSuccess: () => reset('message'),
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Support · ${ticket.subject}`} />

            <div className="min-h-screen bg-white px-5 py-10 text-black dark:bg-black dark:text-white sm:px-8 sm:py-14">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={route('support.index')}
                        className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-zinc-600 transition-colors hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:text-white"
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
                        Tous les tickets
                    </Link>

                    <header className="mt-7 border-b border-zinc-200 pb-6 dark:border-zinc-800">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                {ticket.subject}
                            </h1>
                            <span
                                className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                                    ticket.status === 'open'
                                        ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300'
                                        : 'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                                }`}
                            >
                                {ticket.status === 'open' ? 'Ouvert' : 'Fermé'}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Créé le {formatDate(ticket.created_at)}
                        </p>
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
                            const isCustomer =
                                !isSupport && reply.user_id === auth.user.id;

                            return (
                                <article
                                    key={reply.id}
                                    className={`flex ${
                                        isCustomer
                                            ? 'justify-end'
                                            : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[90%] rounded-md border px-4 py-3 sm:max-w-[75%] ${
                                            isCustomer
                                                ? 'border-zinc-800 bg-black text-white dark:border-zinc-200 dark:bg-white dark:text-black'
                                                : 'border-zinc-200 bg-zinc-50 text-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white'
                                        }`}
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold">
                                                    {isCustomer
                                                        ? 'Vous'
                                                        : reply.user?.name ??
                                                          'Support Team'}
                                                </p>
                                                {isSupport && (
                                                    <span className="rounded border border-zinc-300 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                                                        Support Team
                                                    </span>
                                                )}
                                            </div>
                                            <time
                                                dateTime={reply.created_at}
                                                className={`text-xs ${
                                                    isCustomer
                                                        ? 'text-zinc-300 dark:text-zinc-600'
                                                        : 'text-zinc-500 dark:text-zinc-400'
                                                }`}
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
                                htmlFor="reply-message"
                                className="text-sm font-medium"
                            >
                                Votre réponse
                            </label>
                            <textarea
                                id="reply-message"
                                value={data.message}
                                onChange={(event) =>
                                    setData('message', event.target.value)
                                }
                                maxLength={10000}
                                required
                                rows={5}
                                placeholder="Écrivez votre message…"
                                className="mt-2 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
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
        </AuthenticatedLayout>
    );
}
