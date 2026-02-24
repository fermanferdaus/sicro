import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import '../css/app.css';
import { ToastProvider } from '@/Components/Core/Toast';

(window as any).route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Sicro';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            </StrictMode>,
        );
    },
    progress: false,
});
