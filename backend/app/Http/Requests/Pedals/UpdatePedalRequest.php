<?php

namespace App\Http\Requests\Pedals;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePedalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'pedal_category_id' => ['sometimes', 'required', 'integer', 'exists:pedal_categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'brand' => ['sometimes', 'required', 'string', 'max:100'],
            'model' => ['sometimes', 'nullable', 'string', 'max:100'],
            'type' => ['sometimes', 'nullable', 'string', 'max:50'],
            'description' => ['sometimes', 'nullable', 'string'],
            'price' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:99999999.99'],
            'image' => ['sometimes', 'nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'string', 'max:20'],
        ];
    }
}
