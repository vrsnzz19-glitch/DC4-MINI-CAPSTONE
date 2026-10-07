<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RigPreset extends Model
{
    use HasFactory;

    protected $fillable = [
        'pedalboard_id',
        'name',
        'description',
        'amp_settings',
        'guitar',
        'tuning',
    ];

    /**
     * Get the pedalboard used by this rig preset, if any.
     *
     * @return BelongsTo<Pedalboard, $this>
     */
    public function pedalboard(): BelongsTo
    {
        return $this->belongsTo(Pedalboard::class);
    }

    /**
     * Get the user who owns this rig preset.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Cast the amplifier settings to and from JSON.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amp_settings' => 'array',
        ];
    }
}
