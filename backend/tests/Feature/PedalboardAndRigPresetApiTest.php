<?php

namespace Tests\Feature;

use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\PedalCategory;
use App\Models\RigPreset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PedalboardAndRigPresetApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_crud_only_their_own_pedalboards_and_admins_can_view_all(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $ownerBoard = Pedalboard::factory()->create(['user_id' => $owner->id, 'name' => 'Owner Board']);
        $otherBoard = Pedalboard::factory()->create(['user_id' => $other->id, 'name' => 'Other Board']);
        $category = PedalCategory::factory()->create();
        $pedals = Pedal::factory()->count(2)->create(['pedal_category_id' => $category->id]);
        $this->getJson('/api/pedalboards')->assertUnauthorized();
        Sanctum::actingAs($owner);

        $this->getJson('/api/pedalboards')
            ->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', $ownerBoard->id);
        $this->getJson("/api/pedalboards/{$otherBoard->id}")->assertForbidden();
        $this->putJson("/api/pedalboards/{$otherBoard->id}", ['name' => 'Not allowed'])->assertForbidden();
        $this->deleteJson("/api/pedalboards/{$otherBoard->id}")->assertForbidden();

        $createResponse = $this->postJson('/api/pedalboards', [
            'name' => 'New Board',
            'description' => 'A board for live shows.',
            'pedals' => [$pedals[1]->id, $pedals[0]->id],
            'user_id' => $other->id,
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.owner.id', $owner->id)
            ->assertJsonPath('data.name', 'New Board')
            ->assertJsonPath('data.pedals.0.id', $pedals[1]->id)
            ->assertJsonPath('data.pedals.0.pivot.position', 1)
            ->assertJsonPath('data.pedals.1.id', $pedals[0]->id)
            ->assertJsonPath('data.pedals.1.pivot.position', 2);
        $newBoardId = $createResponse->json('data.id');

        $this->getJson("/api/pedalboards/{$ownerBoard->id}")
            ->assertOk()
            ->assertJsonPath('data.owner.id', $owner->id);
        $this->putJson("/api/pedalboards/{$newBoardId}", ['name' => 'Updated Board'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Updated Board');
        $this->deleteJson("/api/pedalboards/{$newBoardId}")->assertNoContent();
        $this->getJson("/api/pedalboards/{$newBoardId}")->assertNotFound();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        Sanctum::actingAs($admin);
        $this->getJson('/api/pedalboards')
            ->assertOk()
            ->assertJsonPath('meta.total', 2);
        $this->getJson("/api/pedalboards/{$ownerBoard->id}")->assertOk();
        $this->putJson("/api/pedalboards/{$ownerBoard->id}", ['name' => 'Admin cannot edit other owner'])->assertForbidden();
    }

    public function test_pedalboard_creation_rejects_invalid_pedal_ids_without_creating_a_partial_board(): void
    {
        $owner = User::factory()->create();
        Sanctum::actingAs($owner);

        $this->postJson('/api/pedalboards', [
            'name' => 'Invalid Rig',
            'pedals' => [999999],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('pedals.0');

        $this->assertDatabaseMissing('pedalboards', ['name' => 'Invalid Rig', 'user_id' => $owner->id]);
    }

    public function test_pedalboard_pedals_can_be_added_reordered_updated_and_removed(): void
    {
        $owner = User::factory()->create();
        Sanctum::actingAs($owner);
        $board = Pedalboard::factory()->create(['user_id' => $owner->id]);
        $category = PedalCategory::factory()->create();
        $pedals = Pedal::factory()->count(3)->create(['pedal_category_id' => $category->id]);

        $this->postJson("/api/pedalboards/{$board->id}/pedals", [
            'pedal_id' => $pedals[0]->id,
            'position' => 1,
            'settings' => ['level' => 8, 'tone' => 5],
            'notes' => 'Lead boost.',
        ])
            ->assertCreated()
            ->assertJsonPath('data.pedals.0.id', $pedals[0]->id)
            ->assertJsonPath('data.pedals.0.pivot.settings.level', 8)
            ->assertJsonPath('data.pedals.0.pivot.notes', 'Lead boost.');

        $this->postJson("/api/pedalboards/{$board->id}/pedals", ['pedal_id' => $pedals[1]->id])
            ->assertCreated();
        $this->postJson("/api/pedalboards/{$board->id}/pedals", ['pedal_id' => $pedals[2]->id])
            ->assertCreated();

        $this->putJson("/api/pedalboards/{$board->id}/pedals/{$pedals[2]->id}", [
            'position' => 1,
            'settings' => ['mix' => 0.4],
            'notes' => 'Move to the front.',
        ])
            ->assertOk()
            ->assertJsonPath('data.pedals.0.id', $pedals[2]->id)
            ->assertJsonPath('data.pedals.0.pivot.position', 1)
            ->assertJsonPath('data.pedals.0.pivot.settings.mix', 0.4)
            ->assertJsonPath('data.pedals.0.pivot.notes', 'Move to the front.');

        $this->putJson("/api/pedalboards/{$board->id}/pedals/{$pedals[0]->id}", ['position' => 99])
            ->assertUnprocessable();

        $this->deleteJson("/api/pedalboards/{$board->id}/pedals/{$pedals[1]->id}")
            ->assertNoContent();

        $this->getJson("/api/pedalboards/{$board->id}")
            ->assertOk()
            ->assertJsonCount(2, 'data.pedals')
            ->assertJsonPath('data.pedals.0.pivot.position', 1)
            ->assertJsonPath('data.pedals.1.pivot.position', 2);
    }

    public function test_only_an_owner_can_manage_a_board_pedal_relationship(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $board = Pedalboard::factory()->create(['user_id' => $owner->id]);
        $pedal = Pedal::factory()->create();
        Sanctum::actingAs($other);

        $this->postJson("/api/pedalboards/{$board->id}/pedals", ['pedal_id' => $pedal->id])->assertForbidden();
        $this->putJson("/api/pedalboards/{$board->id}/pedals/{$pedal->id}", ['notes' => 'no'])->assertForbidden();
        $this->deleteJson("/api/pedalboards/{$board->id}/pedals/{$pedal->id}")->assertForbidden();

        Sanctum::actingAs($owner);
        $this->postJson("/api/pedalboards/{$board->id}/pedals", ['pedal_id' => 9999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('pedal_id');
    }

    public function test_users_own_preset_crud_and_submit_while_admin_approves_and_archives(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $board = Pedalboard::factory()->create(['user_id' => $owner->id]);
        Sanctum::actingAs($owner);

        $defaultedPreset = $owner->rigPresets()->create(['name' => 'Defaulted status']);
        $defaultedPreset->refresh();
        $this->assertSame('Draft', $defaultedPreset->status);
        $defaultedPreset->delete();

        $this->postJson('/api/rig-presets', [
            'name' => 'Invalid Status',
            'status' => 'Approved',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $created = $this->postJson('/api/rig-presets', [
            'name' => 'Studio Clean',
            'pedalboard_id' => $board->id,
            'amp_settings' => ['gain' => 3, 'bass' => 5],
            'guitar' => 'Fender Stratocaster',
            'tuning' => 'E Standard',
            'user_id' => $other->id,
        ]);

        $created
            ->assertCreated()
            ->assertJsonPath('data.owner.id', $owner->id)
            ->assertJsonPath('data.status', 'Draft')
            ->assertJsonPath('data.pedalboard.id', $board->id);
        $presetId = $created->json('data.id');

        $this->getJson('/api/rig-presets')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
        $this->getJson("/api/rig-presets/{$presetId}")
            ->assertOk()
            ->assertJsonPath('data.amp_settings.gain', 3);
        $this->putJson("/api/rig-presets/{$presetId}", ['guitar' => 'Gibson Les Paul'])
            ->assertOk()
            ->assertJsonPath('data.guitar', 'Gibson Les Paul');

        $foreignBoard = Pedalboard::factory()->create(['user_id' => $other->id]);
        $this->putJson("/api/rig-presets/{$presetId}", ['pedalboard_id' => $foreignBoard->id])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('pedalboard_id');

        $this->postJson("/api/rig-presets/{$presetId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', 'Submitted');

        $this->putJson("/api/rig-presets/{$presetId}", ['description' => 'Updated after submission'])
            ->assertOk()
            ->assertJsonPath('data.status', 'Draft');
        $this->postJson("/api/rig-presets/{$presetId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', 'Submitted');

        $this->getJson('/api/rig-presets')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);

        Sanctum::actingAs($other);
        $this->getJson("/api/rig-presets/{$presetId}")->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        Sanctum::actingAs($admin);
        $this->getJson('/api/rig-presets')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);
        Sanctum::actingAs($owner);
        $this->putJson("/api/rig-presets/{$presetId}", ['description' => 'Owner updated the approved tone'])
            ->assertOk()
            ->assertJsonPath('data.status', 'Draft');
        $this->postJson("/api/rig-presets/{$presetId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', 'Submitted');

        Sanctum::actingAs($admin);
        $this->postJson("/api/rig-presets/{$presetId}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'Approved');
        Sanctum::actingAs($owner);
        $this->putJson("/api/rig-presets/{$presetId}", ['description' => 'Owner updated the approved tone'])
            ->assertOk()
            ->assertJsonPath('data.status', 'Draft');
        $this->postJson("/api/rig-presets/{$presetId}/submit")
            ->assertOk()
            ->assertJsonPath('data.status', 'Submitted');

        Sanctum::actingAs($admin);
        $this->postJson("/api/rig-presets/{$presetId}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'Approved');
        $this->postJson("/api/rig-presets/{$presetId}/archive")
            ->assertOk()
            ->assertJsonPath('data.status', 'Archived');

        $this->deleteJson("/api/rig-presets/{$presetId}")->assertForbidden();
    }

    public function test_preset_approval_is_admin_only_and_never_allowed_for_the_owner(): void
    {
        $owner = User::factory()->create();
        $owner->forceFill(['role' => 'admin'])->save();
        $preset = RigPreset::factory()->create(['user_id' => $owner->id, 'status' => 'Submitted']);
        Sanctum::actingAs($owner);

        $this->postJson("/api/rig-presets/{$preset->id}/approve")->assertForbidden();

        $this->postJson('/api/rig-presets', ['name' => 'Status Injection', 'status' => 'Approved'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        $user = User::factory()->create();
        $otherPreset = RigPreset::factory()->create(['user_id' => $user->id, 'status' => 'Submitted']);
        Sanctum::actingAs($user);
        $this->postJson("/api/rig-presets/{$otherPreset->id}/approve")->assertForbidden();
        $this->putJson("/api/rig-presets/{$otherPreset->id}", ['status' => 'Approved'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('status');

        Sanctum::actingAs($owner);
        $this->postJson("/api/rig-presets/{$otherPreset->id}/approve")->assertOk();
    }

    public function test_rig_preset_writes_require_authentication_and_users_may_delete_own_drafts(): void
    {
        $this->getJson('/api/rig-presets')->assertUnauthorized();
        $this->postJson('/api/rig-presets', ['name' => 'Private Rig'])->assertUnauthorized();

        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $created = $this->postJson('/api/rig-presets', ['name' => 'Private Rig'])->assertCreated();
        $presetId = $created->json('data.id');
        $this->deleteJson("/api/rig-presets/{$presetId}")->assertNoContent();
    }
}
