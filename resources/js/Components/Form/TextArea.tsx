import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export default forwardRef(function TextArea(
    {
        className = '',
        isFocused = false,
        rows = 3,
        ...props
    }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
        isFocused?: boolean;
    },
    ref,
) {
    const localRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            rows={rows}
            className={cn(
                'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-[#ef5350] focus:ring-1 focus:ring-[#ef5350] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                className,
            )}
            ref={localRef}
        />
    );
});
