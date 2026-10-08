<?php

namespace Database\Factories;

use App\Models\RigPreset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RigPreset>
 */
class RigPresetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->words(2, true).' Rig',
            'description' => fake()->sentence(),
            'amp_settings' => [
                'gain' => fake()->numberBetween(1, 10),
                'bass' => fake()->numberBetween(1, 10),
                'middle' => fake()->numberBetween(1, 10),
                'treble' => fake()->numberBetween(1, 10),
                'volume' => fake()->numberBetween(1, 10),
            ],
            'guitar' => 'Fender Stratocaster',
            'tuning' => 'E Standard',
            'status' => 'Draft',
        ];
    }
}
