<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Produk;
use App\Observers\ProdukObserver;
use App\Models\Pengeluaran;
use App\Observers\PengeluaranObserver;
use App\Models\User;
use App\Observers\UserObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $app = $this->app;

        if ($app->environment('production') && method_exists($app, 'usePublicPath')) {
            $app->usePublicPath(realpath(base_path() . '/..'));
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Produk::observe(ProdukObserver::class);
        Pengeluaran::observe(PengeluaranObserver::class);
        User::observe(UserObserver::class);

        \Illuminate\Support\Facades\RateLimiter::for('api', function (\Illuminate\Http\Request $request) {
            return \Illuminate\Cache\RateLimiting\Limit::perMinute(10)->by($request->user()?->id ?: $request->ip())->response(function (\Illuminate\Http\Request $request, array $headers) {
                return response()->json([
                    'message' => 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.'
                ], 429, $headers);
            });
        });
    }
}
