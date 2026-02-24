import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: React.InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={cn(
                'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-[#ef5350] focus:ring-1 focus:ring-[#ef5350] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                className,
            )}
            ref={localRef}
        />
    );
});
