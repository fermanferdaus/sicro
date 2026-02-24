import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType) => {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, message, type }]);

            // Auto remove after 3 seconds
            setTimeout(() => {
                removeToast(id);
            }, 3000);
        },
        [removeToast],
    );

    const success = useCallback(
        (message: string) => showToast(message, 'success'),
        [showToast],
    );
    const error = useCallback(
        (message: string) => showToast(message, 'error'),
        [showToast],
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error }}>
            {children}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex w-80 animate-in items-start gap-3 rounded-xl p-4 shadow-lg ring-1 transition-all duration-300 slide-in-from-right-full ${
                            toast.type === 'success'
                                ? 'bg-white ring-green-100'
                                : 'bg-white ring-red-100'
                        } `}
                    >
                        {toast.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                        )}

                        <div className="flex-1 pt-0.5">
                            <h4
                                className={`text-sm font-bold ${toast.type === 'success' ? 'text-green-900' : 'text-red-900'}`}
                            >
                                {toast.type === 'success'
                                    ? 'Berhasil'
                                    : 'Gagal'}
                            </h4>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                {toast.message}
                            </p>
                        </div>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
