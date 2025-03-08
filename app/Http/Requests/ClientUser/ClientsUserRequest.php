<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientsUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'client_id' => 'required|exists:clients,client_id',
            'user_id' => 'required|exists:users,user_id',
            'notes' => 'nullable|string'
        ];
    }
}