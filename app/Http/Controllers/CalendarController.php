<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Service;
use App\Models\SpecialDate;
use Inertia\Inertia;
use Illuminate\Http\Request;


class CalendarController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->user_id;
        // Cargar las citas con la relación del cliente
        $appointmentsData = Appointments::with('client')
            ->where('user_id', $userId)
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
        $services = Service::where('user_id', $userId)->get();
        // Obtener días especiales
        $specialDates = SpecialDate::where('user_id', $userId)->get();
        //Obtener config del calendario 
        $config = CalendarConfig::where('user_id', $userId)->first();
        // Agrupamos los servicios por categoría
        $categories = $services->groupBy('category')->map(fn($servicesInCategory, $categoryName) => [
            'name' => $categoryName,
            'services' => $servicesInCategory->map(fn($service) => [
                'service_id' => $service->service_id,
                'name' => $service->name,
                'price' => $service->price,
                'duration' => $service->duration,
            ])->values()->all()
        ])->values()->all();

        return Inertia::render('Calendar/Index', [
            'appointments' => $appointmentsData,
            'categories' => $categories,
            'specialDates' => $specialDates,
            'configCalendar' => $config
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

    public function updateAppointment(AppointmentRequest $request, $id)
    {
        $appointment = Appointments::where('appointment_id', $id)->firstOrFail();
        $appointment->update($request->validated());
        return redirect()->route('calendar.index')->with('success', 'Cita actualizada correctamente.');
    }
    public function destroy($appointment_id)
    {
        $appointment = Appointments::where('appointment_id', $appointment_id)->firstOrFail();
        $appointment->delete();
        return redirect()->route('calendar.index')->with('success', 'Cita eliminada correctamente.');
    }
    public function configIndex()
    {
        // Obtener configuración actual o usar valores predeterminados
        $config = CalendarConfig::firstOrNew(['user_id' => auth()->user()->user_id], [
            'show_weekend' => false,
            'start_time' => '08:00',
            'end_time' => '20:00',
            'business_days' => [1, 2, 3, 4, 5]
        ]);
        // Obtener fechas especiales
        $specialDates = SpecialDate::where('user_id', auth()->user()->user_id)->get();

        // Convertir a array para poder añadir la propiedad special_dates
        $configArray = $config->toArray();
        // Añadir special_dates como una propiedad de config
        $configArray['special_dates'] = $specialDates;

        return Inertia::render('Calendar/Config', [
            'config' => $configArray
        ]);

    }
    public function saveConfig(Request $request)
    {
        $validated = $request->validate([
            'show_weekend' => 'boolean',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'business_days' => 'required|array'
        ]);

        $config = CalendarConfig::updateOrCreate(
            ['user_id' => auth()->user()->user_id],
            $validated
        );

        return redirect()->route('calendar.config')
            ->with('success', 'Configuración guardada correctamente');
    }

    public function getAvailableSlots(Request $request)
    {
        $date = $request->get('date');
        $userId = auth()->user()->user_id;

        // Obtener la configuración del usuario
        $config = CalendarConfig::where('user_id', $userId)->first();

        // Obtener las citas existentes para esa fecha
        $existingAppointments = Appointments::where('user_id', $userId)
            ->whereDate('start_time', $date)
            ->get();

        // Generar slots disponibles
        $availableSlots = [];
        $startHour = (int) explode(':', $config->start_time)[0];
        $endHour = (int) explode(':', $config->end_time)[0];

        // Valor predeterminado o configurado
        $maxAppointmentsPerHour = $config->max_appointments_per_hour ?? 2;

        for ($hour = $startHour; $hour < $endHour; $hour++) {
            $startTime = sprintf('%02d:00', $hour);
            $endTime = sprintf('%02d:00', $hour + 1);

            // Contar citas existentes en esta hora
            $appointmentsInHour = $existingAppointments->filter(function ($appointment) use ($hour) {
                return (int) explode(':', $appointment->start_time)[0] === $hour;
            })->count();

            $available = max(0, $maxAppointmentsPerHour - $appointmentsInHour);

            if ($available > 0) {
                $availableSlots[] = [
                    'startTime' => $startTime,
                    'endTime' => $endTime,
                    'available' => $available
                ];
            }
        }

        return response()->json(['availableSlots' => $availableSlots]);
    }
}
