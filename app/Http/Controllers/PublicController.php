<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\CalendarConfig;
use App\Models\Client;
use App\Models\ClientsUser;
use App\Models\Service;
use App\Models\SpecialDate;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Log;

class PublicController extends Controller
{
    // Controlador publico para appointments
    public function showRegistrationForm($userId = null)
    {
        // Si no se proporciona un userId, redirigir a página de error o home
        if (!$userId) {
            return redirect()->route('welcome')->with('error', 'Usuario no especificado');
        }

        // Verificar si el usuario existe
        $user = User::where('user_id', $userId)->first();
        if (!$user) {
            return redirect()->route('home')->with('error', 'Usuario no encontrado');
        }

        // Obtener configuración del calendario
        $config = CalendarConfig::where('user_id', $userId)->first();

        // Obtener días especiales
        $specialDates = SpecialDate::where('user_id', $userId)->get();

        // Obtener servicios agrupados por categoría
        $services = Service::where('user_id', $userId)->get();
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
            'config' => $config,
            'specialDates' => $specialDates
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
    private function generateClientId($user_id)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . "CL-" . $randomNumber;
    }
    public function storeAppointment(Request $request, $userId)
    {
        // Verificar si el usuario existe
        $user = User::where('user_id', $userId)->first();
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
        DB::beginTransaction();

        try {
            // Validar datos de entrada
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'user_id' => 'required|string|exists:users,user_id',
                'service_id' => 'required|string|exists:services,service_id',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'payment_type' => 'required|in:efectivo,tarjeta',
                // Datos del cliente
                'client_name' => 'required|string|max:255',
                'client_email' => 'required|email|max:255',
                'client_phone' => 'required|string|max:20',
            ]);

            // Buscar si el cliente ya existe por email
            $client = Client::where('email', $validatedData['client_email'])->first();

            if (!$client) {
                // Si no existe el cliente, crearlo
                $clientId = $this->generateClientId($validatedData['user_id']);

                $client = Client::create([
                    'client_id' => $clientId,
                    'name' => $validatedData['client_name'],
                    'email' => $validatedData['client_email'],
                    'contact_number' => $validatedData['client_phone'],
                ]);
                // Asociar el usuario al cliente en la tabla pivote
                ClientsUser::create([
                    'client_id' => $client->client_id,
                    'user_id' => $userId,
                    'notes' => "Cliente creado por " . $user->name,
                ]);
            }

            // Verificar disponibilidad antes de crear la cita
            $appointmentDate = Carbon::parse($validatedData['start_time'])->format('Y-m-d');
            $startTimeStr = Carbon::parse($validatedData['start_time'])->format('H:i');
            $endTimeStr = Carbon::parse($validatedData['end_time'])->format('H:i');

            // Crear una instancia del CalendarController para obtener slots disponibles
            $calendarController = new CalendarController();
            $availableSlotsResponse = $calendarController->getAvailableSlots($appointmentDate, $validatedData['user_id']);
            $availableSlots = json_decode($availableSlotsResponse->getContent(), true)['availableSlots'] ?? [];

            // Verificar si el horario seleccionado está disponible
            $isSlotAvailable = false;
            foreach ($availableSlots as $slot) {
                if ($slot['startTime'] === $startTimeStr) {
                    $isSlotAvailable = true;
                    break;
                }
            }

            if (!$isSlotAvailable) {
                DB::rollBack();
                throw ValidationException::withMessages([
                    'start_time' => ['El horario seleccionado no está disponible. Por favor elige otro.']
                ]);
            }

            // Generar ID de cita
            $appointmentId = $this->generateAppointmentId(
                $validatedData['user_id'],
                $validatedData['service_id'],
                $client->client_id
            );

            // Crear la cita
            $appointment = Appointments::create([
                'appointment_id' => $appointmentId,
                'user_id' => $validatedData['user_id'],
                'client_id' => $client->client_id,
                'service_id' => $validatedData['service_id'],
                'title' => $validatedData['title'],
                'start_time' => $validatedData['start_time'],
                'end_time' => $validatedData['end_time'],
                'payment_type' => $validatedData['payment_type'],
                'status' => 'pendiente',
            ]);

            // Si todo salió bien, confirmar la transacción
            DB::commit();
            $shareUrl = route('appointments.confirmation', ['appointment_id' => $appointmentId]);

            // Generar URL para compartir

            return redirect()->route('appointments.confirmation', ['appointment_id' => $appointmentId])->with([
                'success' => true,
                'message' => 'Cita registrada correctamente',
                'share_url' => $shareUrl
            ]);
        } catch (\Exception $e) {
            // Si ocurrió algún error, deshacer todos los cambios
            DB::rollBack();

            // Registrar el error para depuración
            FacadesLog::error('Error al registrar cita: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al registrar la cita',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function showConfirmation($appointment_id)
    {
        $appointment = Appointments::with(['client', 'service'])
            ->where('appointment_id', $appointment_id)
            ->firstOrFail();

        // Generar la URL para compartir
        $shareUrl = route('appointments.confirmation', ['appointment_id' => $appointment_id]);

        // También obtener de la sesión si existe
        $sessionShareUrl = session('share_url');

        return Inertia::render('Appointments/AppointmentSuccess', [
            'appointment' => [
                'id' => $appointment->appointment_id,
                'title' => $appointment->title,
                'start_time' => $appointment->start_time,
                'end_time' => $appointment->end_time,
                'service_name' => $appointment->service->name ?? 'Servicio no especificado',
                'client_name' => $appointment->client->name ?? 'Cliente no especificado',
                'payment_type' => $appointment->payment_type,
                'status' => $appointment->status
            ],
            'shareUrl' => $sessionShareUrl ?? $shareUrl,
            'success' => session('success', true),
            'message' => session('message', 'Cita registrada correctamente')
        ]);
    }

    public function getAvailableSlots($date, $userId)
    {
        try {
            // Validar formato de fecha
            if (!Carbon::hasFormat($date, 'Y-m-d')) {
                return response()->json(['error' => 'Formato de fecha inválido'], 400);
            }

            // Validar que el usuario exista
            $user = User::where('user_id', $userId)->first();
            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }

            // Reutilizar la lógica del CalendarController
            $calendarController = new CalendarController();
            return $calendarController->getAvailableSlots($date, $userId);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener slots disponibles',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
