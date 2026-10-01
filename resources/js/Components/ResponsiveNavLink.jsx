import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-black bg-zinc-50 text-black focus:border-zinc-700 focus:bg-zinc-100 dark:border-white dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-300 dark:focus:bg-zinc-900'
                    : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-black focus:border-zinc-300 focus:bg-zinc-50 focus:text-black dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-950 dark:hover:text-white dark:focus:border-zinc-700 dark:focus:bg-zinc-950 dark:focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
