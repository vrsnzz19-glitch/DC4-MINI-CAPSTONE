<?php

namespace App\Http\Requests\RigPresets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRigPresetRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:150'],
            'pedalboard_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('pedalboards', 'id')->where('user_id', $this->user()->id),
            ],
            'description' => ['sometimes', 'nullable', 'string'],
            'amp_settings' => ['sometimes', 'nullable', 'array'],
            'guitar' => ['sometimes', 'nullable', 'string', 'max:100'],
            'tuning' => ['sometimes', 'nullable', 'string', 'max:50'],
            'status' => ['prohibited'],
        ];
    }
}
