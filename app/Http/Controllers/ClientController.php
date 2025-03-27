<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Client;
use App\Models\ClientsUser;
use App\Models\Service;
use App\Models\SpecialDate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        // Primero obtenemos los IDs de clientes asociados al usuario
        $clientIds = ClientsUser::where('user_id', $userId)->pluck('client_id');

        // Obtenemos todos los clientes con sus datos completos
        $clients = Client::whereIn('client_id', $clientIds)->get();
        //extraer unicamente el nombre de la categoria y el service_id
        // Primero obtenemos todos los servicios del usuario
        $services = Service::where('user_id', $userId)->get();

        // Agrupamos los servicios por categoría
        $categories = $services->groupBy('category')->map(function ($servicesInCategory, $categoryName) {
            return [
                'name' => $categoryName,
                'services' => $servicesInCategory->map(function ($service) {
                    return [
                        'service_id' => $service->service_id,
                        'name' => $service->name,
                        'price' => $service->price,
                        'duration' => $service->duration,
                        // Otros campos que necesites del servicio
                    ];
                })->values()->all()
            ];
        })->values()->all();

        // Para cada cliente, buscamos sus citas relacionadas con el usuario actual
        $formattedClients = $clients->map(function ($client) use ($userId) {
            // Obtenemos todas las citas para este cliente que están asociadas con el usuario actual
            $appointments = Appointments::where('client_id', $client->client_id)
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
        $config = CalendarConfig::where('user_id', $userId)->first();
        $specialDates = SpecialDate::where('user_id', $userId)->get();
        return Inertia::render('Clients/Index', ['clients' => $formattedClients, 'category' => $categories, 'config' => $config, 'specialDates' => $specialDates]);
    }

    private function generateClientId($user_id)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . "CL-" . $randomNumber;
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'client_id' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'contact_number' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($validatedData) {

            $userAuth = Auth::user();
            $userId = $userAuth->user_id;
            $validatedData['client_id'] = $this->generateClientId(
                $userId,
            );
            $client = Client::create(array_merge($validatedData, [
                'client_id' => $validatedData['client_id'],
            ]));

            // Asociar el usuario al cliente en la tabla pivote
            ClientsUser::create([
                'client_id' => $client->client_id,
                'user_id' => $userId,
                'notes' => "Cliente creado por " . $userAuth->name,
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

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;

        $client = Client::where('client_id', $clientId)->firstOrFail();
        $client->update($validatedData);
        // Actualizar la relación en la tabla pivote si es necesario
        if ($request->has('user_id')) {
            ClientsUser::updateOrCreate(
                ['client_id' => $client->client_id, 'user_id' => $userId],
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

    /**
     * APPOINTMENTS INTERACTIONS.*
     */
    public function destroyClientsAppointments($appointment_id)
    {
        $appointment = Appointments::where('appointment_id', $appointment_id)->firstOrFail();
        $appointment->delete();
        return redirect()->route('clients.index')->with('success', 'Cita eliminada correctamente.');
    }
    private function generateAppointmentId($user_id, $service_id, $client_id)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $serviceInitials = strtoupper(substr($service_id, 0, 2));
        $clientInitials = strtoupper(substr($client_id, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . $serviceInitials . $clientInitials . $randomNumber;
    }
    public function storeClientsAppointments(AppointmentRequest $request)
    {
        $validatedData = $request->validated();

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        $validatedData['user_id'] = $userId;

        $appointmentId = $this->generateAppointmentId(
            $userId,
            $validatedData['service_id'],
            $validatedData['client_id']
        );

        $appointment = Appointments::create(array_merge($validatedData, [
            'appointment_id' => $appointmentId,
        ]));

        return redirect()->route('clients.index')->with('success', 'Cita creada correctamente.');
    }
    public function updateAppointment(AppointmentRequest $request, $id)
    {
        $appointment = Appointments::where('appointment_id', $id)->firstOrFail();
        $appointment->update($request->validated());
        return redirect()->route('clients.index')->with('success', 'Cita actualizada correctamente.');
    }
}
