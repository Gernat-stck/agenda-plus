<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\Service;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        // Cargar las citas con la relación del cliente
        $appointmentsData = Appointments::with('client')
            ->where('user_id', auth()->user()->user_id)
            ->get()
            ->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'appointment_id' => $appointment->appointment_id,
                    'user_id' => $appointment->user_id,
                    'client_id' => $appointment->client_id,
                    'service_id' => $appointment->service_id,
                    'title' => $appointment->title,
                    'start_time' => $appointment->start_time,
                    'end_time' => $appointment->end_time,
                    'payment_type' => $appointment->payment_type,
                    'status' => $appointment->status,
                    'created_at' => $appointment->created_at,
                    'updated_at' => $appointment->updated_at,
                    'client_name' => $appointment->client ? $appointment->client->name : 'Cliente sin nombre'
                ];
            });

        // Primero obtenemos todos los servicios del usuario
        $services = Service::where('user_id', auth()->user()->user_id)->get();

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
                    ];
                })->values()->all()
            ];
        })->values()->all();

        return Inertia::render('Calendar/Index', [
            'appointments' => $appointmentsData,
            'categories' => $categories
        ]);
    }

    private function generateAppointmentId($user_id, $service_id, $client_id)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $serviceInitials = strtoupper(substr($service_id, 0, 2));
        $clientInitials = strtoupper(substr($client_id, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . $serviceInitials . $clientInitials . $randomNumber;
    }

    public function store(AppointmentRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = auth()->user()->user_id;

        $appointmentId = $this->generateAppointmentId(
            auth()->user()->user_id,
            $validatedData['service_id'],
            $validatedData['client_id']
        );

        $appointment = Appointments::create(array_merge($validatedData, [
            'appointment_id' => $appointmentId,
        ]));

        return redirect()->route('calendar.index')->with('success', 'Cita creada correctamente.');
    }
    public function storeClientsPage(AppointmentRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = auth()->user()->user_id;

        $appointmentId = $this->generateAppointmentId(
            auth()->user()->user_id,
            $validatedData['service_id'],
            $validatedData['client_id']
        );

        $appointment = Appointments::create(array_merge($validatedData, [
            'appointment_id' => $appointmentId,
        ]));

        return redirect()->route('clients.index')->with('success', 'Cita creada correctamente.');
    }
    public function show($id)
    {
        $appointment = Appointments::with(['user', 'client', 'service'])->findOrFail('appointment_id', $id);
        return response()->json($appointment);
    }

    public function update(AppointmentRequest $request, $id)
    {
        $appointment = Appointments::where('appointment_id', $id)->firstOrFail();
        $appointment->update($request->validated());
        return redirect()->route('appointments.index')->with('success', 'Cita actualizada correctamente.');
    }

    public function destroy($id)
    {
        $appointment = Appointments::where('appointment_id', $id)->firstOrFail();
        $appointment->delete();
        return redirect()->route('appointments.index')->with('success', 'Cita eliminada correctamente.');
    }
    public function destroyClientsPage($appointment_id)
    {
        $appointment = Appointments::where('appointment_id', $appointment_id)->firstOrFail();
        $appointment->delete();
        return redirect()->route('clients.index')->with('success', 'Cita eliminada correctamente.');
    }
}