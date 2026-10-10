<?php

namespace Database\Seeders;

use App\Models\PedalCategory;
use App\Models\Pedal;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Categories
        $overdrive = PedalCategory::firstOrCreate(['name' => 'Overdrive / Distortion']);
        $delay = PedalCategory::firstOrCreate(['name' => 'Delay / Reverb']);
        $modulation = PedalCategory::firstOrCreate(['name' => 'Modulation']);

        // 2. Create Sample Pedals
        Pedal::create([
            'pedal_category_id' => $overdrive->id,
            'brand' => 'Ibanez',
            'model' => 'TS9 Tube Screamer',
            'type' => 'Overdrive',
            'description' => 'Classic green overdrive pedal.',
        ]);

        Pedal::create([
            'pedal_category_id' => $delay->id,
            'brand' => 'BOSS',
            'model' => 'DD-8 Digital Delay',
            'type' => 'Delay',
            'description' => 'Versatile delay pedal with multiple modes.',
        ]);

        Pedal::create([
            'pedal_category_id' => $overdrive->id,
            'brand' => 'M-Vave',
            'model' => 'Tank-G',
            'type' => 'Multi-FX',
            'description' => 'Portable multi-effects pedal.',
        ]);
    }
}
