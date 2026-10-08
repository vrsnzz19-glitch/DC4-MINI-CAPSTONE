<?php

namespace App\Http\Requests\Pedalboards;

use Illuminate\Foundation\Http\FormRequest;

class StorePedalboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
