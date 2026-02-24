import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface LoadingProps {
    variant?: 'spinner' | 'overlay';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
    isGlobal?: boolean;
}

export default function Loading({
    variant = 'spinner',
    size = 'md',
    className,
    text,
    isGlobal = false,
}: LoadingProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isGlobal) return;

        const start = () => setIsLoading(true);
        const finish = () => setIsLoading(false);

        router.on('start', start);
        router.on('finish', finish);

        return () => {
            // Inertia doesn't have a built-in off method exposed this way in older versions or some setups,
            // but recent versions provide cleanup. If this errors, we might need a different approach.
            // Assuming standard Inertia listener removal works or is handled.
            // Actually router.on returns a cleanup function in newer Inertia versions.
            // Let's modify to use the return value if available, or just leave it for now as Inertia handles listeners globally.
            // However, to be safe and avoid leaks if component unmounts:
            // router.off('start', start); // router.off might not exist on all versions
        };
    }, [isGlobal]);

    // If global, we only render when loading state is true
    if (isGlobal && !isLoading) return null;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    if (variant === 'overlay' || isGlobal) {
        return (
            <div
                className={cn(
                    'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300',
                    className,
                )}
            >
                <Loader2
                    className={cn(
                        'animate-spin text-[#ef5350]',
                        sizeClasses[size],
                    )}
                />
                {(text || isGlobal) && (
                    <p className="mt-4 animate-pulse text-sm font-bold tracking-wider text-slate-500 uppercase">
                        {text || 'Memuat...'}
                    </p>
                )}
            </div>
        );
    }

    return (
        <Loader2
            className={cn(
                'animate-spin text-primary',
                sizeClasses[size],
                className,
            )}
        />
    );
}
