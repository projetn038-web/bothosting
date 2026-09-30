import { Head, Link, useForm } from '@inertiajs/react';

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
            <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
                <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-10">
                    <Link
                        href="/"
                        className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                    >
                        ← Retour à l’accueil
                    </Link>
                    <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        Espace sécurisé
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                        Administration
                    </h1>
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        Saisissez le mot de passe administrateur pour continuer.
                    </p>

                    <form className="mt-8 space-y-5" onSubmit={submit}>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium text-slate-200"
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
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                            />
                            {errors.password && (
                                <p className="text-sm text-rose-300" role="alert">
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
