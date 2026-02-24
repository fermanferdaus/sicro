import { cn } from '@/lib/utils';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={cn(
                'inline-flex items-center justify-center rounded-lg bg-[#ef5350] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#e53935] disabled:cursor-not-allowed disabled:opacity-70',
                className,
            )}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
