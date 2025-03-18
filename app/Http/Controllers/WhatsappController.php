<?php

namespace App\Http\Controllers;

use App\Models\WhatsappConfiguration;
use App\Services\TwilioService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class WhatsappController extends Controller
{
    public function index()
    {
        $configurations = WhatsappConfiguration::where('user_id', auth()->id())->get();
        return Inertia::render('WhatsappConfigurations/Index', ['configurations' => $configurations]);
    }

    public function create()
    {
        return Inertia::render('WhatsappConfigurations/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'instance_id' => 'required',
            'token' => 'required',
        ]);

        WhatsappConfiguration::create([
            'user_id' => auth()->id(),
            'instance_id' => $request->instance_id,
            'token' => $request->token,
            'status' => 'pending', // Estado inicial
        ]);

        return redirect()->route('whatsapp-configurations.index');
    }

    public function edit(WhatsappConfiguration $configuration)
    {
        return Inertia::render('WhatsappConfigurations/Edit', ['configuration' => $configuration]);
    }

    public function update(Request $request, WhatsappConfiguration $configuration)
    {
        $request->validate([
            'instance_id' => 'required',
            'token' => 'required',
        ]);

        $configuration->update([
            'instance_id' => $request->instance_id,
            'token' => $request->token,
        ]);

        return redirect()->route('whatsapp-configurations.index');
    }

    public function destroy(WhatsappConfiguration $configuration)
    {
        $configuration->delete();
        return redirect()->route('whatsapp-configurations.index');
    }

    public function connect(WhatsappConfiguration $configuration)
    {
        $response = Http::get("https://api.ultramsg.com/{$configuration->instance_id}/messages/chat?token={$configuration->token}");

        if ($response->successful()) {
            $configuration->update(['status' => 'active']);
            // aquí se puede obtener el numero de telefono
            // $configuration->update(['phone_number' => '123456789']);
        } else {
            $configuration->update(['status' => 'disconnected']);
        }

        return redirect()->route('whatsapp-configurations.index');
    }

    public function disconnect(WhatsappConfiguration $configuration)
    {
        $configuration->update(['status' => 'disconnected']);
        return redirect()->route('whatsapp-configurations.index');
    }
    public function sendTestMessage(Request $request)
    {
        $to = "whatsapp:" . $request->get('to'); // Asegúrate de que el número incluya el prefijo "whatsapp:"
        $body = "Hola, este es un mensaje de prueba enviado desde Twilio en Laravel.";

        $twilio = new TwilioService();
        $message = $twilio->sendWhatsappMessage($to, $body);

        return response()->json([
            'message_sid' => $message->sid,
            'status' => $message->status,
        ]);
    }
}