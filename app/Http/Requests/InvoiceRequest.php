<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return [
            'invoice_id' => 'required|string|unique:invoices',
            'user_id' => 'required|string',
            'client_id' => 'nullable|string',
            'appointment_id' => 'nullable|string',
            'invoice_type' => 'required|string',
            'status' => 'required|string',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
            'transaction_data' => 'nullable|json',
        ];
    }
}