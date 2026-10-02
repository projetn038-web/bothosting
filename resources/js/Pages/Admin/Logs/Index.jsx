import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({ logs, logAvailable }) {
    return (
        <AdminLayout>
            <Head title="Logs système" />

            <div className="px-5 py-10 sm:px-8 sm:py-14">
                <div className="mx-auto max-w-7xl">
                    <header>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Administration
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Logs système
                        </h1>
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Les 500 dernières lignes de laravel.log.
                        </p>
                    </header>

                    <section
                        aria-label="Logs Laravel"
                        className="mt-8 overflow-hidden rounded-md border border-zinc-800"
                    >
                        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
                            <span
                                aria-hidden="true"
                                className="h-2.5 w-2.5 rounded-full bg-red-500"
                            />
                            <span
                                aria-hidden="true"
                                className="h-2.5 w-2.5 rounded-full bg-yellow-500"
                            />
                            <span
                                aria-hidden="true"
                                className="h-2.5 w-2.5 rounded-full bg-green-500"
                            />
                            <span className="ml-2 font-mono text-xs text-zinc-400">
                                storage/logs/laravel.log
                            </span>
                        </div>
                        {logAvailable ? (
                            <pre className="h-96 overflow-y-auto whitespace-pre-wrap break-words bg-black p-4 font-mono text-xs leading-6 text-green-400 sm:text-sm">
                                {logs || 'Le fichier de log est vide.'}
                            </pre>
                        ) : (
                            <p className="bg-black p-4 font-mono text-sm text-zinc-400">
                                Aucun fichier de log disponible.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </AdminLayout>
    );
}
