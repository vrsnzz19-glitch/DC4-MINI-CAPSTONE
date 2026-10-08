<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedalboardPedalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'type' => $this->type,
            'category' => PedalCategoryResource::make($this->whenLoaded('category')),
            'pivot' => [
                'id' => $this->pivot->id,
                'position' => $this->pivot->position,
                'settings' => $this->pivot->settings,
                'notes' => $this->pivot->notes,
            ],
        ];
    }
}
