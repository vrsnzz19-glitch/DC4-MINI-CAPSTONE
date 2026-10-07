<?php

namespace Database\Factories;

use App\Models\Pedal;
use App\Models\PedalCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pedal>
 */
class PedalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'pedal_category_id' => PedalCategory::factory(),
            'name' => fake()->words(2, true),
            'brand' => fake()->company(),
            'model' => fake()->bothify('Model ##'),
            'type' => fake()->word(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 40, 400),
            'image' => null,
            'status' => 'active',
        ];
    }
}
