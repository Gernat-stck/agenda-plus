<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Service;
use App\Models\SpecialDate;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{

    public function index()
    {
        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
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

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        $validatedData['user_id'] = $userId;

        $appointmentId = $this->generateAppointmentId(
            $userId->user_id,
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
        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        // Obtener configuración actual o usar valores predeterminados
        $config = Cache::remember('calendar_config_' . $userId, 60 * 24, function () use ($userId) {

            $config = CalendarConfig::firstOrNew(['user_id' => $userId], [
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

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        $validated = $request->validate([
            'show_weekend' => 'boolean',
            'start_time' => 'required|string',
            'end_time' => 'required|string',
            'business_days' => 'required|array'
        ]);

        $config = CalendarConfig::updateOrCreate(
            ['user_id' => $userId],
            $validated
        );

        return redirect()->route('calendar.config')
            ->with('success', 'Configuración guardada correctamente');
    }

    public function getAvailableSlots($date, $user_id = null)
    {

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        // Usar el user_id proporcionado en la URL o el del usuario autenticado
        $userId = $user_id ?? $userId;

        if (!Carbon::hasFormat($date, 'Y-m-d')) {
            return response()->json(['error' => 'Formato de fecha inválido'], 400);
        }

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

        // Obtener el día de la semana (0 = domingo, 6 = sábado)
        $dayOfWeek = Carbon::parse($date)->dayOfWeek;

        // Verificar si es un día laborable según la configuración
        if (!in_array($dayOfWeek, $config->business_days)) {
            return response()->json(['availableSlots' => [], 'message' => 'Este día no es laborable']);
        }

        // Verificar si es una fecha especial no disponible
        $specialDate = SpecialDate::where('user_id', $userId)
            ->where('date', $date)
            ->first();

        if ($specialDate && !$specialDate->is_available) {
            return response()->json(['availableSlots' => [], 'message' => $specialDate->description ?? 'Esta fecha no está disponible']);
        }

        // Obtener las citas existentes para esa fecha
        $existingAppointments = Appointments::select('start_time', 'end_time')
            ->where('user_id', $userId)
            ->whereDate('start_time', $date)
            ->get();

        // Determinar la duración del slot basada en el servicio si existe
        $slotDuration = 30; // Duración por defecto en minutos

        // Generar slots disponibles
        $availableSlots = [];
        $startHour = (int) explode(':', $config->start_time)[0];
        $startMinute = (int) explode(':', $config->start_time)[1];
        $endHour = (int) explode(':', $config->end_time)[0];
        $endMinute = (int) explode(':', $config->end_time)[1];

        // Asegurarse de tener el valor correcto para max_appointments (por defecto 1)
        $maxAppointmentsPerHour = $config->max_appointments ?? 1;

        // Crear slots cada 30 minutos (o el intervalo que desees)
        $slotInterval = 30; // Minutos entre cada slot

        $currentTime = Carbon::parse("$date $startHour:$startMinute:00");
        $endTime = Carbon::parse("$date $endHour:$endMinute:00");

        while ($currentTime < $endTime) {
            $slotStart = clone $currentTime;
            $slotEnd = (clone $slotStart)->addMinutes($slotDuration);

            // Si el slot termina después del horario de cierre, no lo incluimos
            if ($slotEnd > $endTime) {
                $currentTime->addMinutes($slotInterval);
                continue;
            }

            // Contar cuántas citas se solapan con este slot
            $overlappingAppointments = $existingAppointments->filter(function ($appointment) use ($slotStart, $slotEnd) {
                $appointmentStart = Carbon::parse($appointment->start_time);
                $appointmentEnd = Carbon::parse($appointment->end_time);

                // Verificar si hay solapamiento
                return $slotStart->lessThan($appointmentEnd) && $appointmentStart->lessThan($slotEnd);
            })->count();

            // Verificar disponibilidad según max_appointments
            $available = max(0, $maxAppointmentsPerHour - $overlappingAppointments);

            if ($available > 0) {
                $availableSlots[] = [
                    'startTime' => $slotStart->format('H:i'),
                    'endTime' => $slotEnd->format('H:i'),
                    'available' => $available
                ];
            }

            $currentTime->addMinutes($slotInterval);
        }

        return response()->json(['availableSlots' => $availableSlots]);
    }
}
