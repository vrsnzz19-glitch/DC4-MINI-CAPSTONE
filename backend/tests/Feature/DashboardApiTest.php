<?php

namespace Tests\Feature;

use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\RigPreset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_statistics_are_authenticated_and_scoped_to_the_signed_in_user(): void
    {
        $this->getJson('/api/dashboard')->assertUnauthorized();

        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        Pedal::factory()->count(3)->create();
        Pedalboard::factory()->count(2)->create(['user_id' => $user->id]);
        Pedalboard::factory()->create(['user_id' => $otherUser->id]);
        RigPreset::factory()->count(2)->create(['user_id' => $user->id]);
        RigPreset::factory()->create(['user_id' => $otherUser->id]);

        Sanctum::actingAs($user);
        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    'total_pedals' => 3,
                    'total_pedalboards' => 2,
                    'total_rig_presets' => 2,
                    'submitted_rig_presets' => null,
                ],
            ]);

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        RigPreset::factory()->create(['user_id' => $otherUser->id, 'status' => 'Submitted']);
        Sanctum::actingAs($admin);
        $this->getJson('/api/dashboard')
            ->assertOk()
            ->assertExactJson([
                'data' => [
                    'total_pedals' => 3,
                    'total_pedalboards' => 3,
                    'total_rig_presets' => 4,
                    'submitted_rig_presets' => 1,
                ],
            ]);
    }
}
