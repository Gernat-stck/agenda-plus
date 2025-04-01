<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use App\Mail\SupportFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Enviar el correo
        Mail::to('appcitassv@gmail.com')->send(new ContactFormMail($validated));

        return response()->json(['message' => 'Mensaje enviado con éxito']);
    }
    public function sendSupport(Request $request)
    {
        try {
            $validated = $request->validate([
                'requestType' => 'required|string|in:consulta,reporte,reclamo,sugerencia',
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            // Enviar el correo de soporte
            Mail::to('appcitassv@gmail.com')->send(new SupportFormMail($validated));

            return response()->json([
                'success' => true,
                'message' => '¡Gracias! Tu solicitud ha sido enviada correctamente.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al enviar correo de soporte: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ocurrió un error al enviar el formulario: ' . $e->getMessage()
            ], 500);
        }
    }
}
