import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { login } from '@/routes';
import Footer from '@/Components/Layout/Footer';
import PrimaryButton from '@/Components/Form/PrimaryButton';

export default function Login() {
    const { profil } = usePage<any>().props;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login.url());
    };

    return (
        <>
            <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
                {/* Animated Circles Background Decor */}
                <div className="pointer-events-none fixed top-[-10%] right-[-10%] z-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
                <div className="pointer-events-none fixed bottom-[-5%] left-[-5%] z-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>

                <div className="ios-safe-top ios-safe-bottom relative z-10 flex w-full max-w-md flex-col items-center justify-between">
                    {/* Login Card */}
                    <div className="w-full rounded-xl border border-slate-200 bg-white p-8 pt-0 shadow-xl shadow-[#ef5350]/5">
                        {/* Header Section */}
                        <div className="mb-3 w-full text-center">
                            <div className="inline-flex h-50 w-50 items-center justify-center">
                                {profil?.logo_url ? (
                                    <img
                                        src={profil.logo_url}
                                        alt="Logo"
                                        className="h-50 w-50 object-contain"
                                    />
                                ) : (
                                    <span className="material-icons text-6xl text-slate-900">
                                        store
                                    </span>
                                )}
                            </div>
                            <p className="mb-4 text-xl font-medium text-muted-foreground text-slate-900">
                                Sistem Informasi Keuangan{' '}
                                {profil?.nama_store || 'UMKM'}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="ml-1 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-xl text-muted-foreground/50">
                                        person
                                    </span>
                                    <input
                                        type="text"
                                        className="w-full rounded-lg border border-transparent bg-secondary py-3.5 pr-4 pl-12 text-sm font-medium text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350] focus:outline-none"
                                        placeholder="username"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData('username', e.target.value)
                                        }
                                    />
                                </div>
                                {errors.username && (
                                    <p className="ml-1 text-xs text-red-500">
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="ml-1 flex items-center justify-between">
                                    <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Password
                                    </label>
                                </div>
                                <div className="relative">
                                    <span className="material-icons absolute top-1/2 left-4 -translate-y-1/2 text-xl text-muted-foreground/50">
                                        lock_outline
                                    </span>
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        className="w-full rounded-lg border border-transparent bg-secondary py-3.5 pr-12 pl-12 text-sm font-medium text-foreground transition-all outline-none placeholder:text-muted-foreground focus:border-[#ef5350] focus:ring-2 focus:ring-[#ef5350] focus:outline-none"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-primary"
                                    >
                                        <span className="material-icons py-1 text-xl">
                                            {showPassword
                                                ? 'visibility'
                                                : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="ml-1 text-xs text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Login Button */}
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl py-3 text-sm font-bold"
                            >
                                <span>
                                    {processing ? 'Logging in...' : 'Login'}
                                </span>
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </>
    );
}
