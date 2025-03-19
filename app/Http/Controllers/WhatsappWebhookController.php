<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WhatsappWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        // Validar la solicitud si es necesario y procesar la información.
        \Log::info('Webhook de Twilio recibido: ', $request->all());

        // Lo ideal es actualizar el estado del mensaje o registrar los eventos en tu base de datos.
        return response('Ok', 200);
    }
}
