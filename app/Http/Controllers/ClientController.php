<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientsUser;
use App\Models\Service;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->user_id;

        // Primero obtenemos los IDs de clientes asociados al usuario
        $clientIds = ClientsUser::where('user_id', $userId)->pluck('client_id');

        // Obtenemos todos los clientes con sus datos completos
        $clients = Client::whereIn('client_id', $clientIds)->get();
        //extraer unicamente el nombre de la categoria y el service_id
        $category = Service::where('user_id', auth()->user()->user_id)->get()
            ->map(function ($service) {
                return [
                    'service_id' => $service->service_id,
                    'category' => $service->category
                ];
            })
            ->unique('category');

        // Para cada cliente, buscamos sus citas relacionadas con el usuario actual
        $formattedClients = $clients->map(function ($client) use ($userId) {
            // Obtenemos todas las citas para este cliente que están asociadas con el usuario actual
            $appointments = \App\Models\Appointments::where('client_id', $client->client_id)
                ->where('user_id', $userId)
                ->get()
                ->map(function ($appointment) {
                    return [
                        'appointment_id' => $appointment->appointment_id,
                        'service_id' => $appointment->service_id,
                        'title' => $appointment->title,
                        'start_time' => $appointment->start_time,
                        'end_time' => $appointment->end_time,
                        'status' => $appointment->status,
                        'payment_type' => $appointment->payment_type
                    ];
                });

            // Formateamos el cliente con la estructura deseada
            return [
                'client_id' => $client->client_id,
                'name' => $client->name,
                'email' => $client->email,
                'contact_number' => $client->contact_number,
                'citas' => $appointments
            ];
        });

        return Inertia::render('Clients/Index', ['clients' => $formattedClients, 'category' => $category]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'client_id' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'contact_number' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($validatedData) {
            $client = Client::create($validatedData);

            // Asociar el usuario al cliente en la tabla pivote
            ClientsUser::create([
                'client_id' => $client->client_id,
                'user_id' => auth()->user()->user_id,
                'notes' => "Cliente creado por " . auth()->user()->name,
            ]);
        });

        return redirect()->route('clients.index')->with('success', 'Cliente creado correctamente.');
    }

    public function show(Client $client)
    {
        $client->load('users');
        return response()->json($client);
    }

    public function update(Request $request, $clientId)
    {
        $validatedData = $request->validate([
            'client_id' => 'required|string|max:255',
            'email' => 'required|email',
            'contact_number' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);
        $client = Client::where('client_id', $clientId)->firstOrFail();
        $client->update($validatedData);
        // Actualizar la relación en la tabla pivote si es necesario
        if ($request->has('user_id')) {
            ClientsUser::updateOrCreate(
                ['client_id' => $client->client_id, 'user_id' => auth()->user()->user_id],
                ['notes' => $request->notes]
            );
        }

        return redirect()->route('clients.index')->with('success', 'Cliente actualizado correctamente.');
    }

    public function destroy($clientId)
    {
        $client = Client::where('client_id', $clientId)->firstOrFail();
        $client->delete();
        return redirect()->route('clients.index')->with('success', 'Cliente eliminado correctamente.');
    }

    public function attachUser(ClientsUser $request)
    {
        $validateData = $request->validate([
            'client_id' => 'required|exists:clients,client_id',
            'user_id' => 'required|exists:users,user_id',
            'notes' => 'nullable|string',
        ]);
        $clientsUser = ClientsUser::create($validateData->all());
        return redirect()->route('clients.index')->with('success', 'Usuario asociado al cliente correctamente.');
    }

    public function detachUser(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,client_id',
            'user_id' => 'required|exists:users,user_id',
        ]);

        ClientsUser::where('client_id', $request->client_id)
            ->where('user_id', $request->user_id)
            ->delete();

        return redirect()->route('clients.index')->with('success', 'Usuario desasociado del cliente correctamente.');
    }
}
