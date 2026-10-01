export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-zinc-300 bg-white text-black focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:checked:bg-white dark:focus:ring-zinc-400 ' +
                className
            }
        />
    );
}
