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
        $appointments = Appointments::latest()->paginate(10);
        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments
        ]);
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


}