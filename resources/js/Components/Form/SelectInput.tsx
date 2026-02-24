import { forwardRef, SelectHTMLAttributes, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    isFocused?: boolean;
    options: { value: string; label: string }[];
    placeholder?: string;
}

export default forwardRef(function SelectInput(
    {
        className = '',
        isFocused = false,
        options,
        placeholder = 'Pilih opsi',
        ...props
    }: SelectInputProps,
    ref,
) {
    const localRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            className={cn(
                'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 transition-colors focus:border-[#ef5350] focus:ring-1 focus:ring-[#ef5350] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                className,
            )}
            ref={localRef}
        >
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});
