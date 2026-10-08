<?php

namespace App\Providers;

use App\Models\Pedalboard;
use App\Models\RigPreset;
use App\Policies\PedalboardPolicy;
use App\Policies\RigPresetPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Pedalboard::class, PedalboardPolicy::class);
        Gate::policy(RigPreset::class, RigPresetPolicy::class);
    }
}
