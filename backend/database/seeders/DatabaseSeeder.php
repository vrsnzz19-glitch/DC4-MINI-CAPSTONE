<?php

namespace Database\Seeders;

use App\Models\PedalCategory;
use App\Models\Pedal;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create test accounts
        User::updateOrCreate(
            ['email' => 'admin@tonevault.test'],
            [
                'name' => 'ToneVault Administrator',
                'password' => Hash::make('ToneVaultAdmin!2026'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'guitarist@tonevault.test'],
            [
                'name' => 'Alex Morgan',
                'password' => Hash::make('ToneVaultUser!2026'),
                'role' => 'user',
            ]
        );

        // 2. Seed the full pedal catalog (categories, pedals, boards, presets)
        $this->call(ToneVaultSeeder::class);
    }
}
