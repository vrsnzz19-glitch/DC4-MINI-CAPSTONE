<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PedalCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the pedals in this category.
     *
     * @return HasMany<Pedal, $this>
     */
    public function pedals(): HasMany
    {
        return $this->hasMany(Pedal::class);
    }
}
