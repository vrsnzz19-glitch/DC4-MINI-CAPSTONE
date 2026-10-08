<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedalboard extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    /**
     * Get the user who owns this pedalboard.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who owns this pedalboard.
     *
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->user();
    }

    /**
     * Get the pedals on this board in signal-chain order.
     *
     * @return BelongsToMany<Pedal, $this>
     */
    public function pedals(): BelongsToMany
    {
        return $this->belongsToMany(Pedal::class, 'pedalboard_pedals')
            ->using(PedalboardPedal::class)
            ->withPivot(['id', 'position', 'settings', 'notes'])
            ->withTimestamps()
            ->orderBy('pedalboard_pedals.position');
    }

    /**
     * Get the rig presets based on this pedalboard.
     *
     * @return HasMany<RigPreset, $this>
     */
    public function rigPresets(): HasMany
    {
        return $this->hasMany(RigPreset::class);
    }

    /**
     * Cast the pedalboard status to a string.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }
}
