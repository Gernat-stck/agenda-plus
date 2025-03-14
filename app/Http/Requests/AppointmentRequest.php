<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Definir reglas base
        $rules = [];

        // Para solicitudes PUT o PATCH (actualización), los campos son opcionales
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'title' => 'sometimes|string|max:255',
                'service_id' => 'sometimes|string',
                'client_id' => 'sometimes|string',
                'start_time' => 'sometimes',
                'end_time' => 'sometimes',
                'payment_type' => 'sometimes|in:efectivo,tarjeta',
                'status' => 'sometimes|in:pendiente,en curso,finalizado,cancelado',
            ];
        }
        // Para solicitudes POST (creación), los campos son requeridos
        else {
            $rules = [
                'title' => 'required|string|max:255',
                'service_id' => 'required|string',
                'client_id' => 'required|string',
                'start_time' => 'required',
                'end_time' => 'required',
                'payment_type' => 'required|in:efectivo,tarjeta',
                'status' => 'required|in:pendiente,en curso,finalizado,cancelado',
            ];
        }

        return $rules;
    }
}