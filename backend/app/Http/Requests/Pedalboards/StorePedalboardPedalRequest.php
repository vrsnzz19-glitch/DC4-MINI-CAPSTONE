<?php

namespace App\Http\Requests\Pedalboards;

use Illuminate\Foundation\Http\FormRequest;

class StorePedalboardPedalRequest extends FormRequest
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
            'pedal_id' => ['required', 'integer', 'exists:pedals,id'],
            'position' => ['sometimes', 'integer', 'min:1'],
            'settings' => ['sometimes', 'nullable', 'array'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
