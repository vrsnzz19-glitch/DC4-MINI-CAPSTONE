<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PedalboardPedal extends Pivot
{
    protected $table = 'pedalboard_pedals';

    public $incrementing = true;

    protected function casts(): array
    {
        return [
            'settings' => 'array',
            'position' => 'integer',
        ];
    }
}
