<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    public function index()
    {
        $appointments = Appointments::with(['user', 'client', 'service'])->where('user_id', auth()->user()->user_id)->get();
        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
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

        return redirect()->route('appointments.index')->with('success', 'Cita creada correctamente.');
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
        $appointment = Appointments::with(['user', 'client', 'service'])->findOrFail($id);
        return response()->json($appointment);
    }

    public function update(AppointmentRequest $request, $id)
    {
        $appointment = Appointments::findOrFail($id);
        $appointment->update($request->validated());
        return redirect()->route('appointments.index')->with('success', 'Cita actualizada correctamente.');
    }

    public function destroy($id)
    {
        $appointment = Appointments::findOrFail($id);
        $appointment->delete();
        return redirect()->route('appointments.index')->with('success', 'Cita eliminada correctamente.');
    }
}