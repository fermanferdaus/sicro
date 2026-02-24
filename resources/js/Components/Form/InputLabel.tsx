import { cn } from '@/lib/utils';

export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { value?: React.ReactNode }) {
    return (
        <label
            {...props}
            className={cn(
                'block text-sm font-medium text-slate-700',
                className,
            )}
        >
            {value ? value : children}
        </label>
    );
}
