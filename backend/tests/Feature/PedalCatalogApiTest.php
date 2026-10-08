<?php

namespace Tests\Feature;

use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\PedalCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PedalCatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_pedals_are_publicly_searchable_filterable_and_paginated_with_categories(): void
    {
        $overdrive = PedalCategory::factory()->create(['name' => 'Overdrive']);
        $delay = PedalCategory::factory()->create(['name' => 'Delay']);

        Pedal::factory()->create([
            'pedal_category_id' => $overdrive->id,
            'name' => 'Blues Driver',
            'brand' => 'BOSS',
            'model' => 'BD-2',
            'type' => 'Overdrive',
            'status' => 'active',
        ]);
        Pedal::factory()->create([
            'pedal_category_id' => $delay->id,
            'name' => 'Digital Delay',
            'brand' => 'BOSS',
            'model' => 'DD-8',
            'type' => 'Delay',
            'status' => 'inactive',
        ]);
        Pedal::factory()->count(16)->create([
            'pedal_category_id' => $overdrive->id,
            'type' => 'Overdrive',
            'status' => 'active',
        ]);

        $this->getJson('/api/pedals?search=BD-2&category=Overdrive&type=Overdrive&status=active&page=1')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Blues Driver')
            ->assertJsonPath('data.0.category.name', 'Overdrive')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/pedals?search=DD-8')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Digital Delay');

        $this->getJson('/api/pedals?category='.$overdrive->id.'&search=Blues')
            ->assertOk()
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/pedals?page=2')
            ->assertOk()
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.total', 18)
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_read_update_and_delete_pedals(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        $category = PedalCategory::factory()->create();
        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/pedals', [
            'pedal_category_id' => $category->id,
            'name' => 'Blues Driver',
            'brand' => 'BOSS',
            'model' => 'BD-2',
            'type' => 'Overdrive',
            'price' => 119.99,
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.name', 'Blues Driver')
            ->assertJsonPath('data.category.id', $category->id);

        $pedalId = $createResponse->json('data.id');

        $this->getJson("/api/pedals/{$pedalId}")
            ->assertOk()
            ->assertJsonPath('data.model', 'BD-2');

        $this->putJson("/api/pedals/{$pedalId}", ['status' => 'inactive'])
            ->assertOk()
            ->assertJsonPath('data.status', 'inactive');

        $pedal = Pedal::findOrFail($pedalId);
        $pedalboard = Pedalboard::factory()->create(['user_id' => $admin->id]);
        $pedalboard->pedals()->attach($pedal->id, ['position' => 1]);

        $this->deleteJson("/api/pedals/{$pedalId}")->assertNoContent();
        $this->getJson("/api/pedals/{$pedalId}")->assertNotFound();
        $this->assertDatabaseMissing('pedalboard_pedals', ['pedal_id' => $pedalId]);
    }

    public function test_pedal_writes_require_admin_and_validate_input(): void
    {
        $category = PedalCategory::factory()->create();
        $pedal = Pedal::factory()->create(['pedal_category_id' => $category->id]);

        $this->postJson('/api/pedals', [])->assertUnauthorized();

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/pedals', [])->assertForbidden();
        $this->putJson("/api/pedals/{$pedal->id}", ['name' => 'Updated'])->assertForbidden();
        $this->deleteJson("/api/pedals/{$pedal->id}")->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        Sanctum::actingAs($admin);

        $this->postJson('/api/pedals', [
            'pedal_category_id' => 9999,
            'name' => '',
            'brand' => '',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['pedal_category_id', 'name', 'brand']);
    }

    public function test_categories_can_be_browsed_and_administered(): void
    {
        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/categories', [
            'name' => 'Modulation',
            'description' => 'Phasers, chorus, and similar effects.',
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.name', 'Modulation')
            ->assertJsonPath('data.pedals_count', 0);

        $categoryId = $createResponse->json('data.id');

        $this->getJson('/api/categories')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Modulation');

        $this->getJson("/api/categories/{$categoryId}")
            ->assertOk()
            ->assertJsonPath('data.description', 'Phasers, chorus, and similar effects.');

        $this->putJson("/api/categories/{$categoryId}", ['name' => 'Phase'])
            ->assertOk()
            ->assertJsonPath('data.name', 'Phase');

        $this->deleteJson("/api/categories/{$categoryId}")->assertNoContent();
        $this->getJson("/api/categories/{$categoryId}")->assertNotFound();
    }

    public function test_category_writes_are_admin_only_and_categories_with_pedals_cannot_be_deleted(): void
    {
        $category = PedalCategory::factory()->create();
        Pedal::factory()->create(['pedal_category_id' => $category->id]);

        $this->postJson('/api/categories', ['name' => 'New Category'])->assertUnauthorized();

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/categories', ['name' => 'New Category'])->assertForbidden();
        $this->putJson("/api/categories/{$category->id}", ['name' => 'Updated'])->assertForbidden();
        $this->deleteJson("/api/categories/{$category->id}")->assertForbidden();

        $admin = User::factory()->create();
        $admin->forceFill(['role' => 'admin'])->save();
        Sanctum::actingAs($admin);

        $this->deleteJson("/api/categories/{$category->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('category');

        $this->postJson('/api/categories', ['name' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }
}
