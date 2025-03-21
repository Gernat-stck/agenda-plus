<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Service;
use App\Models\SpecialDate;
use Cache;
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
            ->select(
                'id',
                'appointment_id',
                'user_id',
                'client_id',
                'service_id',
                'title',
                'start_time',
                'end_time',
                'payment_type',
                'status',
                'created_at',
                'updated_at'
            )
            ->get()
            ->map(
                fn($appointment) => [
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
                ]
            );

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
        $userId = auth()->user()->user_id;
        // Obtener configuración actual o usar valores predeterminados
        $config = Cache::remember('calendar_config_' . $userId, 60 * 24, function () use ($userId) {

            $config = CalendarConfig::firstOrNew(['user_id' => auth()->user()->user_id], [
                'show_weekend' => false,
                'start_time' => '08:00',
                'end_time' => '20:00',
                'business_days' => [1, 2, 3, 4, 5]
            ]);
        });
        // Obtener fechas especiales

        $specialDates = Cache::remember('special_dates_' . $userId, 60 * 24, function () use ($userId) {
            return SpecialDate::where('user_id', $userId)->get();
        });
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

    public function getAvailableSlots($date, $user_id = null)
    {
        // Usar el user_id proporcionado en la URL o el del usuario autenticado
        $userId = $user_id ?? auth()->user()->user_id;

        // Validar que tengamos un ID de usuario válido
        if (!$userId) {
            return response()->json(['error' => 'Usuario no identificado'], 403);
        }

        // Obtener la configuración del usuario desde caché
        $config = Cache::remember('calendar_config_' . $userId, 60 * 24, function () use ($userId) {
            return CalendarConfig::where('user_id', $userId)->first();
        });

        if (!$config) {
            return response()->json(['error' => 'No se encontró configuración para este usuario'], 404);
        }
        // Obtener las citas existentes para esa fecha
        $existingAppointments = Appointments::select('start_time', 'end_time')
            ->where('user_id', $userId)
            ->whereDate('start_time', $date)
            ->get();

        // Generar slots disponibles
        $availableSlots = [];
        $startHour = (int) explode(':', $config->start_time)[0];
        $endHour = (int) explode(':', $config->end_time)[0];

        // Asegurarse de tener el valor correcto para max_appointments (por defecto 1)
        $maxAppointmentsPerHour = $config->max_appointments ?? 1;
        $slotDuration = 60; // Duración en minutos de cada slot

        // Crear slots cada hora
        for ($hour = $startHour; $hour < $endHour; $hour++) {
            // Para cada hora del día
            for ($minute = 0; $minute < 60; $minute += 30) { // Crear slots cada 30 minutos
                $slotStart = \Carbon\Carbon::parse("$date $hour:$minute:00");
                $slotEnd = (clone $slotStart)->addMinutes($slotDuration);

                // Contar cuántas citas se solapan con este slot
                $overlappingAppointments = $existingAppointments->filter(function ($appointment) use ($slotStart, $slotEnd) {
                    $appointmentStart = \Carbon\Carbon::parse($appointment->start_time);
                    $appointmentEnd = \Carbon\Carbon::parse($appointment->end_time);

                    // Verificar si hay solapamiento
                    return $slotStart->lessThan($appointmentEnd) &&
                        $appointmentStart->lessThan($slotEnd);
                })->count();

                // Si max_appointments es 1 y hay citas solapadas, no mostrar este slot
                if ($maxAppointmentsPerHour == 1 && $overlappingAppointments > 0) {
                    continue;
                }

                $available = max(0, $maxAppointmentsPerHour - $overlappingAppointments);

                if ($available > 0) {
                    $availableSlots[] = [
                        'startTime' => $slotStart->format('H:i'),
                        'endTime' => $slotEnd->format('H:i'),
                        'available' => $available
                    ];
                }
            }
        }

        return response()->json(['availableSlots' => $availableSlots]);
    }
}
