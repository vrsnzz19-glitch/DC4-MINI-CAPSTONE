<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedalResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pedal_category_id' => $this->pedal_category_id,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'type' => $this->type,
            'description' => $this->description,
            'price' => $this->price,
            'image' => $this->image,
            'status' => $this->status,
            'category' => PedalCategoryResource::make($this->whenLoaded('category')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
