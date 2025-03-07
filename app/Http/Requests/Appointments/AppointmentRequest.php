<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AppointmentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'appointment_id' => 'required|string|unique:appointments',
            'user_id' => 'required|string',
            'client_id' => 'required|string',
            'service_id' => 'nullable|string',
            'title' => 'required|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'payment_type' => 'required|in:tarjeta,efectivo',
            'status' => 'required|in:pendiente,en curso,finalizado,cancelado'
        ];
    }
}