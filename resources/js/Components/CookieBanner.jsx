import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'cookies_accepted';

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            setVisible(window.localStorage.getItem(CONSENT_KEY) !== 'true');
        } catch {
            setVisible(true);
        }
    }, []);

    function acceptCookies() {
        try {
            window.localStorage.setItem(CONSENT_KEY, 'true');
        } catch {
            // Keep the current view usable when browser storage is unavailable.
        }

        setVisible(false);
    }

    if (!visible) {
        return null;
    }

    return (
        <aside
            aria-label="Information sur les cookies"
            className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-5xl flex-col gap-4 rounded-md border border-zinc-200 bg-white p-5 text-black dark:border-zinc-800 dark:bg-black dark:text-white sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-6"
            role="region"
        >
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Ce site utilise le stockage local et des cookies nécessaires à
                son fonctionnement. Consultez notre{' '}
                <Link
                    href="/rgpd"
                    className="font-semibold text-black underline underline-offset-2 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
                >
                    politique de confidentialité
                </Link>
                .
            </p>
            <button
                type="button"
                onClick={acceptCookies}
                className="shrink-0 rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus:ring-offset-black"
            >
                Accepter
            </button>
        </aside>
    );
}
