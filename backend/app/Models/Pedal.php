<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pedal extends Model
{
    protected $fillable = [
        'pedal_category_id',
        'name',
        'brand',
        'model',
        'type',
        'description',
        'price',
        'image',
        'status',
    ];

    /**
     * Get the category for this pedal.
     *
     * @return BelongsTo<PedalCategory, $this>
     */
    public function pedalCategory(): BelongsTo
    {
        return $this->belongsTo(PedalCategory::class);
    }

    /**
     * Get the pedalboards containing this pedal.
     *
     * @return BelongsToMany<Pedalboard, $this>
     */
    public function pedalboards(): BelongsToMany
    {
        return $this->belongsToMany(Pedalboard::class, 'pedalboard_pedals')
            ->withPivot(['id', 'position', 'settings', 'notes'])
            ->withTimestamps();
    }

    /**
     * Cast the pedal price to a fixed-point decimal.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
        ];
    }
}
