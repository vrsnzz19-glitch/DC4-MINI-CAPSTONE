<?php

namespace Database\Seeders;

use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\PedalCategory;
use App\Models\RigPreset;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ToneVaultSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@tonevault.test'],
            [
                'name' => 'ToneVault Administrator',
                'password' => Hash::make('ToneVaultAdmin!2026'),
            ],
        );
        $admin->forceFill(['role' => 'admin'])->save();

        $guitarist = User::updateOrCreate(
            ['email' => 'guitarist@tonevault.test'],
            [
                'name' => 'Alex Morgan',
                'password' => Hash::make('ToneVaultUser!2026'),
            ],
        );
        $guitarist->forceFill(['role' => 'user'])->save();

        $categoryDescriptions = [
            'Overdrive' => 'Low to medium gain drive pedals for responsive amp-like breakup.',
            'Distortion' => 'Higher gain clipping pedals for saturated rhythm and lead tones.',
            'Fuzz' => 'Aggressive, harmonically rich fuzz and octave-fuzz effects.',
            'Compressor' => 'Pedals for controlling dynamics, sustain, and attack.',
            'Delay' => 'Echo and delay pedals for rhythmic repeats and ambient trails.',
            'Reverb' => 'Room, spring, plate, and atmospheric reverb effects.',
            'Modulation' => 'Chorus, phaser, flanger, and tremolo effects.',
            'Tuner' => 'Chromatic tuners for accurate stage and studio tuning.',
            'Equalizer' => 'Frequency-shaping pedals for tone control and level boosts.',
            'Noise Gate' => 'Noise reduction pedals for controlling unwanted hum and hiss.',
        ];

        $categories = [];

        foreach ($categoryDescriptions as $name => $description) {
            $categories[$name] = PedalCategory::updateOrCreate(
                ['name' => $name],
                ['description' => $description],
            );
        }

        $pedals = [
            ['category' => 'Overdrive', 'name' => 'Tube Screamer TS9', 'brand' => 'Ibanez', 'model' => 'TS9', 'price' => 109.99],
            ['category' => 'Overdrive', 'name' => 'Tube Screamer TS808', 'brand' => 'Ibanez', 'model' => 'TS808', 'price' => 179.00],
            ['category' => 'Overdrive', 'name' => 'Blues Driver BD-2', 'brand' => 'BOSS', 'model' => 'BD-2', 'price' => 119.99],
            ['category' => 'Overdrive', 'name' => 'Super OverDrive SD-1', 'brand' => 'BOSS', 'model' => 'SD-1', 'price' => 64.99],
            ['category' => 'Overdrive', 'name' => 'Morning Glory V4', 'brand' => 'JHS Pedals', 'model' => 'Morning Glory V4', 'price' => 229.00],
            ['category' => 'Overdrive', 'name' => 'Fulltone OCD', 'brand' => 'Fulltone', 'model' => 'OCD', 'price' => 179.00],
            ['category' => 'Overdrive', 'name' => 'Soul Food', 'brand' => 'Electro-Harmonix', 'model' => 'Soul Food', 'price' => 89.00],
            ['category' => 'Overdrive', 'name' => 'Guv\'nor', 'brand' => 'Marshall', 'model' => 'Guv\'nor', 'price' => 139.00],
            ['category' => 'Overdrive', 'name' => 'Klon Centaur', 'brand' => 'Klon', 'model' => 'Centaur', 'price' => 3500.00],
            ['category' => 'Overdrive', 'name' => 'Timmy Overdrive', 'brand' => 'Paul Cochrane', 'model' => 'Timmy', 'price' => 169.00],
            ['category' => 'Overdrive', 'name' => 'Boss OD-3', 'brand' => 'BOSS', 'model' => 'OD-3', 'price' => 109.99],
            ['category' => 'Overdrive', 'name' => 'TightMetal', 'brand' => 'Boss', 'model' => 'TightMetal', 'price' => 119.00],
            ['category' => 'Distortion', 'name' => 'RAT 2 Distortion', 'brand' => 'Pro Co', 'model' => 'RAT 2', 'price' => 89.99],
            ['category' => 'Distortion', 'name' => 'DS-1 Distortion', 'brand' => 'BOSS', 'model' => 'DS-1', 'price' => 59.99],
            ['category' => 'Distortion', 'name' => 'Riverside Multistage Drive', 'brand' => 'Strymon', 'model' => 'Riverside', 'price' => 279.00],
            ['category' => 'Distortion', 'name' => 'Metal Muff', 'brand' => 'Electro-Harmonix', 'model' => 'Metal Muff', 'price' => 109.00],
            ['category' => 'Distortion', 'name' => 'Distortion+', 'brand' => 'MXR', 'model' => 'M104', 'price' => 79.99],
            ['category' => 'Distortion', 'name' => 'Metal Core ML-2', 'brand' => 'BOSS', 'model' => 'ML-2', 'price' => 99.99],
            ['category' => 'Distortion', 'name' => 'Rat 3', 'brand' => 'Pro Co', 'model' => 'RAT 3', 'price' => 99.00],
            ['category' => 'Distortion', 'name' => 'Boss HM-2', 'brand' => 'BOSS', 'model' => 'HM-2', 'price' => 129.00],
            ['category' => 'Distortion', 'name' => 'Boss DS-2', 'brand' => 'BOSS', 'model' => 'DS-2', 'price' => 79.99],
            ['category' => 'Fuzz', 'name' => 'Big Muff Pi Fuzz', 'brand' => 'Electro-Harmonix', 'model' => 'Big Muff Pi', 'price' => 99.00],
            ['category' => 'Fuzz', 'name' => 'Fuzz Face Mini Silicon', 'brand' => 'Dunlop', 'model' => 'FFM1', 'price' => 129.99],
            ['category' => 'Fuzz', 'name' => 'Tone Bender MKII', 'brand' => 'JMI', 'model' => 'Tone Bender MKII', 'price' => 249.00],
            ['category' => 'Fuzz', 'name' => 'Germanium 4 Big Muff', 'brand' => 'Electro-Harmonix', 'model' => 'Germanium 4', 'price' => 119.00],
            ['category' => 'Fuzz', 'name' => 'Fuzz Face', 'brand' => 'Dunlop', 'model' => 'Fuzz Face', 'price' => 119.00],
            ['category' => 'Fuzz', 'name' => 'Tone Bender', 'brand' => 'Sola Sound', 'model' => 'Tone Bender', 'price' => 229.00],
            ['category' => 'Fuzz', 'name' => 'Octavia', 'brand' => 'Dallas-Arbiter', 'model' => 'Octavia', 'price' => 199.00],
            ['category' => 'Fuzz', 'name' => 'Super Fuzz', 'brand' => 'Shin-Ei', 'model' => 'Super Fuzz', 'price' => 189.00],
            ['category' => 'Compressor', 'name' => 'Dyna Comp Compressor', 'brand' => 'MXR', 'model' => 'M102', 'price' => 99.99],
            ['category' => 'Compressor', 'name' => 'Compressor Plus', 'brand' => 'Keeley', 'model' => 'Compressor Plus', 'price' => 149.00],
            ['category' => 'Compressor', 'name' => 'CS-3 Compression Sustainer', 'brand' => 'BOSS', 'model' => 'CS-3', 'price' => 109.99],
            ['category' => 'Compressor', 'name' => 'Super Comp', 'brand' => 'MXR', 'model' => 'M133', 'price' => 109.00],
            ['category' => 'Compressor', 'name' => 'White Finger', 'brand' => 'Electro-Harmonix', 'model' => 'White Finger', 'price' => 79.00],
            ['category' => 'Compressor', 'name' => 'Boss CP-1X', 'brand' => 'BOSS', 'model' => 'CP-1X', 'price' => 159.99],
            ['category' => 'Compressor', 'name' => 'Orange Squeezer', 'brand' => 'Dan Armstrong', 'model' => 'Orange Squeezer', 'price' => 159.00],
            ['category' => 'Delay', 'name' => 'Memory Toy Analog Delay', 'brand' => 'Electro-Harmonix', 'model' => 'Memory Toy', 'price' => 89.00],
            ['category' => 'Delay', 'name' => 'Digital Delay DD-8', 'brand' => 'BOSS', 'model' => 'DD-8', 'price' => 199.99],
            ['category' => 'Delay', 'name' => 'Carbon Copy Analog Delay', 'brand' => 'MXR', 'model' => 'M169', 'price' => 149.99],
            ['category' => 'Delay', 'name' => 'Timeline Time-Based Effects', 'brand' => 'Strymon', 'model' => 'Timeline', 'price' => 449.00],
            ['category' => 'Delay', 'name' => 'Digital Delay DD-7', 'brand' => 'BOSS', 'model' => 'DD-7', 'price' => 169.99],
            ['category' => 'Delay', 'name' => 'Memory Man', 'brand' => 'Electro-Harmonix', 'model' => 'Memory Man', 'price' => 239.00],
            ['category' => 'Delay', 'name' => 'Carbon Copy Mini', 'brand' => 'MXR', 'model' => 'M301', 'price' => 139.00],
            ['category' => 'Delay', 'name' => 'Boss DD-3', 'brand' => 'BOSS', 'model' => 'DD-3', 'price' => 129.00],
            ['category' => 'Delay', 'name' => 'Echo Park', 'brand' => 'TC Electronic', 'model' => 'Echo Park', 'price' => 149.00],
            ['category' => 'Reverb', 'name' => 'Hall of Fame 2 Reverb', 'brand' => 'TC Electronic', 'model' => 'Hall of Fame 2', 'price' => 179.00],
            ['category' => 'Reverb', 'name' => 'BigSky Reverberator', 'brand' => 'Strymon', 'model' => 'BigSky', 'price' => 479.00],
            ['category' => 'Reverb', 'name' => 'Holy Grail Neo Reverb', 'brand' => 'Electro-Harmonix', 'model' => 'Holy Grail Neo', 'price' => 139.00],
            ['category' => 'Reverb', 'name' => 'Reverb RV-6', 'brand' => 'BOSS', 'model' => 'RV-6', 'price' => 159.99],
            ['category' => 'Reverb', 'name' => 'Cathedral', 'brand' => 'Electro-Harmonix', 'model' => 'Cathedral', 'price' => 149.00],
            ['category' => 'Reverb', 'name' => 'blueSky', 'brand' => 'Strymon', 'model' => 'blueSky', 'price' => 299.00],
            ['category' => 'Reverb', 'name' => 'Hall of Fame Mini', 'brand' => 'TC Electronic', 'model' => 'Hall of Fame Mini', 'price' => 99.00],
            ['category' => 'Reverb', 'name' => 'Boss RV-5', 'brand' => 'BOSS', 'model' => 'RV-5', 'price' => 199.99],
            ['category' => 'Reverb', 'name' => 'Flint', 'brand' => 'Strymon', 'model' => 'Flint', 'price' => 299.00],
            ['category' => 'Modulation', 'name' => 'CE-2W Chorus', 'brand' => 'BOSS', 'model' => 'CE-2W', 'price' => 229.99],
            ['category' => 'Modulation', 'name' => 'Phase 90 Phaser', 'brand' => 'MXR', 'model' => 'M101', 'price' => 99.99],
            ['category' => 'Modulation', 'name' => 'Cry Baby Wah', 'brand' => 'Dunlop', 'model' => 'GCB95', 'price' => 99.99],
            ['category' => 'Modulation', 'name' => 'TR-2 Tremolo', 'brand' => 'BOSS', 'model' => 'TR-2', 'price' => 119.99],
            ['category' => 'Modulation', 'name' => 'Electric Mistress Flanger', 'brand' => 'Electro-Harmonix', 'model' => 'Deluxe Electric Mistress', 'price' => 159.00],
            ['category' => 'Modulation', 'name' => 'BF-3 Flanger', 'brand' => 'BOSS', 'model' => 'BF-3', 'price' => 149.99],
            ['category' => 'Modulation', 'name' => 'Uni-Vibe', 'brand' => 'MXR', 'model' => 'M68', 'price' => 199.00],
            ['category' => 'Modulation', 'name' => 'Small Stone Phaser', 'brand' => 'Electro-Harmonix', 'model' => 'Small Stone', 'price' => 99.00],
            ['category' => 'Modulation', 'name' => 'Boss CH-1', 'brand' => 'BOSS', 'model' => 'CH-1', 'price' => 99.99],
            ['category' => 'Modulation', 'name' => 'Boss PH-3', 'brand' => 'BOSS', 'model' => 'PH-3', 'price' => 169.99],
            ['category' => 'Modulation', 'name' => 'MXR Phase 100', 'brand' => 'MXR', 'model' => 'Phase 100', 'price' => 129.00],
            ['category' => 'Modulation', 'name' => 'TC Electronic Vortex', 'brand' => 'TC Electronic', 'model' => 'Vortex Flanger', 'price' => 179.00],
            ['category' => 'Tuner', 'name' => 'Chromatic Tuner TU-3', 'brand' => 'BOSS', 'model' => 'TU-3', 'price' => 109.99],
            ['category' => 'Tuner', 'name' => 'PolyTune 3 Mini', 'brand' => 'TC Electronic', 'model' => 'PolyTune 3 Mini', 'price' => 99.00],
            ['category' => 'Tuner', 'name' => 'Pitchblack', 'brand' => 'Korg', 'model' => 'Pitchblack', 'price' => 89.00],
            ['category' => 'Tuner', 'name' => 'StroboStomp', 'brand' => 'Peterson', 'model' => 'StroboStomp', 'price' => 229.00],
            ['category' => 'Tuner', 'name' => 'Boss TU-2', 'brand' => 'BOSS', 'model' => 'TU-2', 'price' => 119.00],
            ['category' => 'Tuner', 'name' => 'Korg Pitchclip', 'brand' => 'Korg', 'model' => 'Pitchclip', 'price' => 29.99],
            ['category' => 'Equalizer', 'name' => 'Graphic Equalizer GE-7', 'brand' => 'BOSS', 'model' => 'GE-7', 'price' => 129.99],
            ['category' => 'Equalizer', 'name' => '10-Band EQ', 'brand' => 'MXR', 'model' => 'M108S', 'price' => 119.00],
            ['category' => 'Equalizer', 'name' => 'EQ-200', 'brand' => 'BOSS', 'model' => 'EQ-200', 'price' => 199.99],
            ['category' => 'Equalizer', 'name' => 'Boss EQ-200', 'brand' => 'BOSS', 'model' => 'EQ-200', 'price' => 199.00],
            ['category' => 'Equalizer', 'name' => 'MXR M109', 'brand' => 'MXR', 'model' => 'M109', 'price' => 109.00],
            ['category' => 'Noise Gate', 'name' => 'Decimator II Noise Reduction', 'brand' => 'ISP Technologies', 'model' => 'Decimator II', 'price' => 149.00],
            ['category' => 'Noise Gate', 'name' => 'NS-2 Noise Suppressor', 'brand' => 'BOSS', 'model' => 'NS-2', 'price' => 119.99],
            ['category' => 'Noise Gate', 'name' => 'Smart Gate', 'brand' => 'MXR', 'model' => 'M135', 'price' => 109.00],
            ['category' => 'Noise Gate', 'name' => 'Boss NS-1X', 'brand' => 'BOSS', 'model' => 'NS-1X', 'price' => 149.99],
            ['category' => 'Noise Gate', 'name' => 'MXR M136', 'brand' => 'MXR', 'model' => 'M136', 'price' => 119.00],
            ['category' => 'Overdrive', 'name' => 'Blues Driver BD-2 Waza', 'brand' => 'BOSS', 'model' => 'BD-2W', 'price' => 179.00],
            ['category' => 'Overdrive', 'name' => 'Super OverDrive SD-1W', 'brand' => 'BOSS', 'model' => 'SD-1W', 'price' => 129.00],
            ['category' => 'Overdrive', 'name' => 'Klon KTR', 'brand' => 'Klon', 'model' => 'KTR', 'price' => 3500.00],
            ['category' => 'Overdrive', 'name' => 'Timmy', 'brand' => 'Paul Cochrane', 'model' => 'Timmy', 'price' => 169.00],
            ['category' => 'Distortion', 'name' => 'ProCo RAT', 'brand' => 'Pro Co', 'model' => 'RAT', 'price' => 89.00],
            ['category' => 'Distortion', 'name' => 'Boss DS-1W', 'brand' => 'BOSS', 'model' => 'DS-1W', 'price' => 119.00],
            ['category' => 'Distortion', 'name' => 'Riverside', 'brand' => 'Strymon', 'model' => 'Riverside', 'price' => 279.00],
            ['category' => 'Fuzz', 'name' => 'Big Muff Pi with Tone Wicker', 'brand' => 'Electro-Harmonix', 'model' => 'Big Muff Pi Tone Wicker', 'price' => 119.00],
            ['category' => 'Fuzz', 'name' => 'Russian Big Muff', 'brand' => 'Electro-Harmonix', 'model' => 'Russian Big Muff', 'price' => 109.00],
            ['category' => 'Compressor', 'name' => 'Dyna Comp Custom Shop', 'brand' => 'MXR', 'model' => 'CSP102', 'price' => 129.00],
            ['category' => 'Delay', 'name' => 'DD-200 Digital Delay', 'brand' => 'BOSS', 'model' => 'DD-200', 'price' => 279.00],
            ['category' => 'Delay', 'name' => 'El Capistan', 'brand' => 'Strymon', 'model' => 'El Capistan', 'price' => 449.00],
            ['category' => 'Delay', 'name' => 'Flashback Mini', 'brand' => 'TC Electronic', 'model' => 'Flashback Mini', 'price' => 99.00],
            ['category' => 'Delay', 'name' => 'Nova Delay', 'brand' => 'TC Electronic', 'model' => 'Nova Delay', 'price' => 249.00],
            ['category' => 'Reverb', 'name' => 'RV-500', 'brand' => 'BOSS', 'model' => 'RV-500', 'price' => 449.00],
            ['category' => 'Reverb', 'name' => 'Mercury7', 'brand' => 'Strymon', 'model' => 'Mercury7', 'price' => 449.00],
            ['category' => 'Reverb', 'name' => 'NightSky', 'brand' => 'Strymon', 'model' => 'NightSky', 'price' => 449.00],
            ['category' => 'Modulation', 'name' => 'CE-2 Chorus', 'brand' => 'BOSS', 'model' => 'CE-2', 'price' => 189.00],
            ['category' => 'Modulation', 'name' => 'Dimension C', 'brand' => 'BOSS', 'model' => 'DC-2', 'price' => 169.00],
            ['category' => 'Modulation', 'name' => 'VB-2 Vibrato', 'brand' => 'BOSS', 'model' => 'VB-2', 'price' => 179.00],
            ['category' => 'Modulation', 'name' => 'RT-20 Rotary', 'brand' => 'BOSS', 'model' => 'RT-20', 'price' => 249.00],
            ['category' => 'Modulation', 'name' => 'POG 2', 'brand' => 'Electro-Harmonix', 'model' => 'POG 2', 'price' => 499.00],
            ['category' => 'Modulation', 'name' => 'Micro POG', 'brand' => 'Electro-Harmonix', 'model' => 'Micro POG', 'price' => 349.00],
            ['category' => 'Modulation', 'name' => 'H9 Harmonizer', 'brand' => 'Eventide', 'model' => 'H9', 'price' => 449.00],
            ['category' => 'Modulation', 'name' => 'ModFactor', 'brand' => 'Eventide', 'model' => 'ModFactor', 'price' => 399.00],
            ['category' => 'Tuner', 'name' => 'TU-3S Chromatic Tuner', 'brand' => 'BOSS', 'model' => 'TU-3S', 'price' => 119.00],
            ['category' => 'Tuner', 'name' => 'StroboStomp HD', 'brand' => 'Peterson', 'model' => 'StroboStomp HD', 'price' => 299.00],
            ['category' => 'Equalizer', 'name' => 'GEB-7 Bass EQ', 'brand' => 'BOSS', 'model' => 'GEB-7', 'price' => 129.99],
            ['category' => 'Equalizer', 'name' => 'M108S 10-Band EQ', 'brand' => 'MXR', 'model' => 'M108S', 'price' => 119.00],
            ['category' => 'Equalizer', 'name' => 'ParaEq', 'brand' => 'Empress', 'model' => 'ParaEq', 'price' => 299.00],
            ['category' => 'Noise Gate', 'name' => 'NS-1X Noise Suppressor', 'brand' => 'BOSS', 'model' => 'NS-1X', 'price' => 149.99],
            ['category' => 'Noise Gate', 'name' => 'M135 Smart Gate', 'brand' => 'MXR', 'model' => 'M135', 'price' => 109.00],
        ];

        $pedalsByName = [];

        foreach ($pedals as $pedalData) {
            $category = $categories[$pedalData['category']];
            unset($pedalData['category']);

            $attributes = Pedal::factory()->make([
                ...$pedalData,
                'pedal_category_id' => $category->id,
                'type' => $category->name,
                'description' => $pedalData['name'].' guitar effects pedal.',
                'status' => 'active',
            ])->getAttributes();

            $pedal = Pedal::updateOrCreate(
                ['brand' => $pedalData['brand'], 'name' => $pedalData['name']],
                $attributes,
            );

            $pedalsByName[$pedal->name] = $pedal;
        }

        $boardDefinitions = [
            [
                'name' => 'Classic Rock Board',
                'description' => 'A versatile drive and delay setup for classic rock rhythm and lead tones.',
                'pedals' => ['Chromatic Tuner TU-3', 'Tube Screamer TS9', 'RAT 2 Distortion', 'Carbon Copy Analog Delay'],
            ],
            [
                'name' => 'Ambient Stereo Board',
                'description' => 'Wide modulation and spacious time-based effects for clean ambient textures.',
                'pedals' => ['PolyTune 3 Mini', 'CE-2W Chorus', 'Timeline Time-Based Effects', 'BigSky Reverberator'],
            ],
        ];

        $boards = [];

        foreach ($boardDefinitions as $boardIndex => $boardData) {
            $pedalNames = $boardData['pedals'];
            unset($boardData['pedals']);

            $board = $guitarist->pedalboards()->where('name', $boardData['name'])->first();

            if (! $board) {
                $board = Pedalboard::factory()->make([
                    ...$boardData,
                    'user_id' => $guitarist->id,
                    'status' => 'active',
                ]);
                $guitarist->pedalboards()->save($board);
            } else {
                $board->update([
                    'description' => $boardData['description'],
                    'status' => 'active',
                ]);
            }

            $board->pedals()->sync(
                collect($pedalNames)
                    ->mapWithKeys(fn (string $name, int $position): array => [
                        $pedalsByName[$name]->id => [
                            'position' => $position + 1,
                            'settings' => json_encode(['level' => '12 o’clock']),
                            'notes' => null,
                        ],
                    ])
                    ->all(),
            );

            $boards[$boardIndex] = $board;
        }

        $rigDefinitions = [
            [
                'name' => 'Classic Club Set',
                'description' => 'Edge-of-breakup drive with a short analog echo for live rock sets.',
                'guitar' => 'Fender Player Stratocaster',
                'tuning' => 'E Standard',
                'status' => 'Submitted',
                'board' => $boards[0],
                'amp_settings' => ['gain' => 4, 'bass' => 5, 'middle' => 6, 'treble' => 5, 'reverb' => 2],
            ],
            [
                'name' => 'Ambient Clean Texture',
                'description' => 'Modulated clean tone with long delay repeats and a spacious reverb tail.',
                'guitar' => 'Fender Jazzmaster',
                'tuning' => 'E Standard',
                'status' => 'Approved',
                'board' => $boards[1],
                'amp_settings' => ['gain' => 2, 'bass' => 4, 'middle' => 5, 'treble' => 6, 'reverb' => 3],
            ],
        ];

        foreach ($rigDefinitions as $rigData) {
            $board = $rigData['board'];
            unset($rigData['board']);

            $preset = $guitarist->rigPresets()->where('name', $rigData['name'])->first();

            if (! $preset) {
                $preset = RigPreset::factory()->make([
                    ...$rigData,
                    'user_id' => $guitarist->id,
                    'pedalboard_id' => $board->id,
                ]);
                $preset->pedalboard()->associate($board);
                $preset->forceFill(['status' => $rigData['status']]);
                $guitarist->rigPresets()->save($preset);
            } else {
                $preset->pedalboard()->associate($board);
                $preset->forceFill([
                    'description' => $rigData['description'],
                    'guitar' => $rigData['guitar'],
                    'tuning' => $rigData['tuning'],
                    'amp_settings' => $rigData['amp_settings'],
                    'status' => $rigData['status'],
                ])->save();
            }
        }
    }
}
