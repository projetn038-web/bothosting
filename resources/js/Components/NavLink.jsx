import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-black text-black focus:border-zinc-700 dark:border-white dark:text-white dark:focus:border-zinc-300'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-black focus:border-zinc-300 focus:text-black dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white dark:focus:border-zinc-700 dark:focus:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
