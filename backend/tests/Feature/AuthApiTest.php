<?php

namespace Tests\Feature;

use App\Models\Pedal;
use App\Models\Pedalboard;
use App\Models\PedalCategory;
use App\Models\RigPreset;
use App\Models\User;
use Database\Seeders\ToneVaultSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_creates_a_normal_user_and_returns_a_token(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Jordan Rivera',
            'email' => 'jordan@example.test',
            'password' => 'SecureToneVault123!',
            'password_confirmation' => 'SecureToneVault123!',
            'role' => 'admin',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonPath('user.email', 'jordan@example.test')
            ->assertJsonPath('user.role', 'user')
            ->assertJsonMissingPath('user.password');

        $this->assertDatabaseHas('users', [
            'email' => 'jordan@example.test',
            'role' => 'user',
        ]);
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }

    public function test_registration_returns_validation_errors_for_invalid_input(): void
    {
        $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'different',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);

        $this->assertDatabaseCount('users', 0);
    }

    public function test_login_returns_a_token_and_invalid_credentials_return_unauthorized(): void
    {
        User::factory()->create([
            'email' => 'guitarist@example.test',
            'password' => 'SecureToneVault123!',
        ]);

        $this->postJson('/api/login', [
            'email' => 'guitarist@example.test',
            'password' => 'SecureToneVault123!',
        ])
            ->assertOk()
            ->assertJsonPath('token_type', 'Bearer')
            ->assertJsonPath('user.role', 'user');

        $this->postJson('/api/login', [
            'email' => 'guitarist@example.test',
            'password' => 'incorrect-password',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('message', 'The provided credentials are incorrect.');
    }

    public function test_authenticated_user_can_view_profile_and_revoke_current_token(): void
    {
        $user = User::factory()->create([
            'email' => 'guitarist@example.test',
        ]);
        $token = $user->createToken('test-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.email', 'guitarist@example.test')
            ->assertJsonMissingPath('data.password');

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout successful.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/user')->assertUnauthorized();
    }

    public function test_admin_middleware_allows_admins_and_forbids_regular_users(): void
    {
        Route::middleware(['auth:sanctum', 'admin'])
            ->get('/api/admin-check', fn () => response()->json(['ok' => true]));

        $user = User::factory()->create(['role' => 'user']);
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->forceFill(['role' => 'admin'])->save();

        $this->getJson('/api/admin-check')->assertUnauthorized();

        $this->withToken($user->createToken('user-token')->plainTextToken)
            ->getJson('/api/admin-check')
            ->assertForbidden();

        $this->app['auth']->forgetGuards();

        $this->withToken($admin->createToken('admin-token')->plainTextToken)
            ->getJson('/api/admin-check')
            ->assertOk()
            ->assertJsonPath('ok', true);
    }

    public function test_tonevault_seeder_creates_repeatable_realistic_sample_data(): void
    {
        $this->seed(ToneVaultSeeder::class);
        $this->seed(ToneVaultSeeder::class);

        $this->assertDatabaseCount('users', 2);
        $this->assertDatabaseCount('pedal_categories', 10);
        $this->assertGreaterThanOrEqual(20, Pedal::count());
        $this->assertDatabaseCount('pedalboards', 2);
        $this->assertDatabaseCount('rig_presets', 2);

        $admin = User::where('email', 'admin@tonevault.test')->firstOrFail();
        $guitarist = User::where('email', 'guitarist@tonevault.test')->firstOrFail();

        $this->assertSame('admin', $admin->role);
        $this->assertTrue(Hash::check('ToneVaultAdmin!2026', $admin->password));
        $this->assertSame('user', $guitarist->role);
        $this->assertTrue(Hash::check('ToneVaultUser!2026', $guitarist->password));
        $this->assertSame(10, PedalCategory::whereHas('pedals')->count());
        $this->assertSame(8, Pedalboard::withCount('pedals')->get()->sum('pedals_count'));
        $this->assertSame(2, RigPreset::whereNotNull('pedalboard_id')->count());
    }
}
