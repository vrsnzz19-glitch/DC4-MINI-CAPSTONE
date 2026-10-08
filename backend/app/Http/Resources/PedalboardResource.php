<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedalboardResource extends JsonResource
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
            'description' => $this->description,
            'status' => $this->status,
            'pedals' => PedalboardPedalResource::collection($this->whenLoaded('pedals')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
