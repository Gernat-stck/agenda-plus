<?php

namespace App\Http\Controllers;

use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
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
}
