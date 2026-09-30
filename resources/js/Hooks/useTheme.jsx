import { useCallback, useEffect, useState } from 'react';

const storageKey = 'theme';

function getStoredTheme() {
    try {
        const storedTheme = window.localStorage.getItem(storageKey);

        return storedTheme === 'light' || storedTheme === 'dark'
            ? storedTheme
            : null;
    } catch {
        return null;
    }
}

function getSystemTheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function getInitialTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return getStoredTheme() ?? getSystemTheme();
}

export default function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

        const applyTheme = (nextTheme) => {
            root.classList.toggle('dark', nextTheme === 'dark');
        };

        const handleSystemChange = (event) => {
            if (getStoredTheme() === null) {
                setTheme(event.matches ? 'dark' : 'light');
            }
        };

        const handleStorageChange = (event) => {
            if (event.key === storageKey || event.key === null) {
                setTheme(getStoredTheme() ?? getSystemTheme());
            }
        };

        const handleThemeChange = (event) => {
            setTheme(event.detail);
        };

        applyTheme(theme);
        if (mediaQuery?.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemChange);
        } else {
            mediaQuery?.addListener(handleSystemChange);
        }
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('app:theme-change', handleThemeChange);

        return () => {
            if (mediaQuery?.removeEventListener) {
                mediaQuery.removeEventListener('change', handleSystemChange);
            } else {
                mediaQuery?.removeListener(handleSystemChange);
            }
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('app:theme-change', handleThemeChange);
        };
    }, [theme]);

    const toggleTheme = useCallback(() => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);

        try {
            window.localStorage.setItem(storageKey, nextTheme);
        } catch {
            // The current tab can still use the selected theme without storage access.
        }

        window.dispatchEvent(
            new CustomEvent('app:theme-change', { detail: nextTheme }),
        );
    }, [theme]);

    return { theme, toggleTheme };
}
