<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RigPresetResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'owner' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'name' => $this->name,
            'pedalboard_id' => $this->pedalboard_id,
            'pedalboard' => PedalboardResource::make($this->whenLoaded('pedalboard')),
            'description' => $this->description,
            'amp_settings' => $this->amp_settings,
            'guitar' => $this->guitar,
            'tuning' => $this->tuning,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
