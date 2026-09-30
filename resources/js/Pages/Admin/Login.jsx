import { Head, Link, useForm } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    function submit(event) {
        event.preventDefault();

        post('/admin/login', {
            onFinish: () => reset('password'),
        });
    }

    return (
        <>
            <Head title="Administration" />
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
                <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30 sm:p-10">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                            ← Retour à l’accueil
                        </Link>
                        <ThemeToggle />
                    </div>
                    <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">
                        Espace sécurisé
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                        Administration
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        Saisissez le mot de passe administrateur pour continuer.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={submit}>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-slate-700 dark:text-slate-200"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-400"
                            />
                            {errors.password && (
                                <p className="text-sm text-rose-600 dark:text-rose-300" role="alert">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? 'Vérification…' : 'Se connecter'}
                        </button>
                    </form>
                </section>
            </main>
        </>
    );
}
