import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
}

export default function Index({ tickets }) {
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            subject: '',
            message: '',
        });

    function createTicket(event) {
        event.preventDefault();

        post(route('support.store'), {
            onSuccess: () => {
                reset();
                setIsCreatingTicket(false);
            },
        });
    }

    function openCreateTicket() {
        clearErrors();
        setIsCreatingTicket(true);
    }

    return (
        <AuthenticatedLayout>
            <Head title="Support" />

            <div className="min-h-screen bg-white px-5 py-10 text-black dark:bg-black dark:text-white sm:px-8 sm:py-14">
                <div className="mx-auto max-w-7xl">
                    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                Centre d’assistance
                            </p>
                            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                                Vos tickets
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                Retrouvez vos demandes et échangez avec notre
                                équipe de support.
                            </p>
                        </div>
                        <PrimaryButton
                            type="button"
                            onClick={openCreateTicket}
                            className="justify-center px-5 py-3 text-sm normal-case tracking-normal"
                        >
                            Nouveau ticket
                        </PrimaryButton>
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
                        aria-label="Liste des tickets"
                        className="mt-8 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800"
                    >
                        {tickets.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                                <h2 className="text-lg font-semibold">
                                    Aucun ticket pour le moment
                                </h2>
                                <p className="max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    Créez un ticket si vous avez besoin d’aide
                                    avec votre compte ou vos bots.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[620px] divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
                                    <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                                        <tr>
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {tickets.map((ticket) => (
                                            <tr
                                                key={ticket.id}
                                                className="bg-white transition-colors hover:bg-zinc-50 dark:bg-black dark:hover:bg-zinc-950"
                                            >
                                                <td className="px-5 py-4 font-medium">
                                                    <Link
                                                        href={route(
                                                            'support.show',
                                                            ticket.id,
                                                        )}
                                                        className="rounded-sm underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                    >
                                                        {ticket.subject}
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-md border px-2.5 py-1 text-xs font-medium ${
                                                            ticket.status ===
                                                            'open'
                                                                ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300'
                                                                : 'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                                                        }`}
                                                    >
                                                        {ticket.status ===
                                                        'open'
                                                            ? 'Ouvert'
                                                            : 'Fermé'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-zinc-600 dark:text-zinc-400">
                                                    {formatDate(
                                                        ticket.created_at,
                                                    )}
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

            {isCreatingTicket && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsCreatingTicket(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="new-ticket-title"
                        className="w-full max-w-xl rounded-md border border-zinc-200 bg-white p-6 text-black dark:border-zinc-800 dark:bg-black dark:text-white sm:p-8"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="new-ticket-title"
                                    className="text-xl font-semibold tracking-tight"
                                >
                                    Créer un ticket
                                </h2>
                                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                    Décrivez votre demande, nous vous
                                    répondrons ici.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreatingTicket(false)}
                                aria-label="Fermer"
                                className="rounded-md px-2 py-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                            >
                                <svg
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        strokeLinecap="round"
                                        d="m6 6 12 12M18 6 6 18"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={createTicket}
                            className="mt-6 flex flex-col gap-5"
                        >
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="ticket-subject"
                                    className="text-sm font-medium"
                                >
                                    Sujet
                                </label>
                                <TextInput
                                    id="ticket-subject"
                                    value={data.subject}
                                    onChange={(event) =>
                                        setData('subject', event.target.value)
                                    }
                                    maxLength={255}
                                    required
                                    autoFocus
                                    className="w-full"
                                />
                                {errors.subject && (
                                    <p
                                        className="text-sm text-red-700 dark:text-red-300"
                                        role="alert"
                                    >
                                        {errors.subject}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="ticket-message"
                                    className="text-sm font-medium"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="ticket-message"
                                    value={data.message}
                                    onChange={(event) =>
                                        setData('message', event.target.value)
                                    }
                                    maxLength={10000}
                                    required
                                    rows={6}
                                    className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                                />
                                {errors.message && (
                                    <p
                                        className="text-sm text-red-700 dark:text-red-300"
                                        role="alert"
                                    >
                                        {errors.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsCreatingTicket(false)
                                    }
                                    className="rounded-md border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:hover:bg-zinc-900"
                                >
                                    Annuler
                                </button>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="justify-center px-4 py-2.5 text-sm normal-case tracking-normal"
                                >
                                    {processing
                                        ? 'Envoi…'
                                        : 'Créer le ticket'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
