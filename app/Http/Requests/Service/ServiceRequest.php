<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'service_id' => 'required|string|unique:services',
            'user_id' => 'required|string',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'duration' => 'required|integer',
            'price' => 'required|numeric',
        ];
    }
}