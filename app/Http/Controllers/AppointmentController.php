<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Service;
use App\Models\SpecialDate;
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
    public function appointmentRegisterLink()
    {
        $userId = auth()->user()->user_id;
        $url = env('APP_URL') . '/appointment/register/' . $userId;
        return Inertia::render('Appointments/RegisterLink', [
            'url' => $url
        ]);
    }
    public function appointmentRegister($userId)
    {
        $services = Service::all();
        $config = CalendarConfig::where('user_id', $userId)->first();
        $specialDates = SpecialDate::where('user_id', $userId)->get();

        $categories = $services->groupBy('category')->map(fn($servicesInCategory, $categoryName) => [
            'name' => $categoryName,
            'services' => $servicesInCategory->map(fn($service) => [
                'service_id' => $service->service_id,
                'name' => $service->name,
                'price' => $service->price,
                'duration' => $service->duration,
            ])->values()->all()
        ])->values()->all();

        return Inertia::render('Appointments/RegisterDate', [
            'userId' => $userId,
            'categories' => $categories,
            'config' => $config ? $config->toArray() : null,
            'specialDates' => $specialDates ? $specialDates->toArray() : []
        ]);
    }
}