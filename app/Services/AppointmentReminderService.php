<?php

namespace App\Services;

use App\Models\Appointments;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AppointmentReminderService
{
    protected $twilioService;

    public function __construct(TwilioService $twilioService)
    {
        $this->twilioService = $twilioService;
    }

    /**
     * Envía recordatorios para citas próximas
     * 
     * @param int $hoursBeforeAppointment Enviar recordatorio X horas antes de la cita
     * @return int Número de recordatorios enviados
     */
    public function sendUpcomingReminders(int $hoursBeforeAppointment = 24): int
    {
        // Calcular el rango de tiempo para enviar recordatorios
        $startTime = Carbon::now();
        $endTime = Carbon::now()->addHours($hoursBeforeAppointment);

        // Buscar citas dentro del rango que no tengan recordatorios enviados
        $appointments = Appointments::with(['client', 'service'])
            ->whereBetween('start_time', [$startTime, $endTime])
            ->where('status', 'pendiente')
            ->where('reminder_sent', false)
            ->get();

        $count = 0;

        foreach ($appointments as $appointment) {
            if (!$appointment->client || !$appointment->client->contact_number) {
                Log::warning("No se puede enviar recordatorio: cliente sin número para cita {$appointment->appointment_id}");
                continue;
            }

            try {
                // Formatear fecha y hora para el mensaje
                $date = Carbon::parse($appointment->start_time)->format('d/m/Y');
                $time = Carbon::parse($appointment->start_time)->format('H:i');
                $contacNumber = Client::where('client_id', $appointment->client->client_id)->first()->contact_number;


                // Construir mensaje
                $message = "Recordatorio: Tienes una cita para {$appointment->service->name} el día {$date} a las {$time}. Por favor confirma tu asistencia respondiendo a este mensaje.";

                // Formatear número para WhatsApp (agregar prefijo 'whatsapp:')
                $to = 'whatsapp:+' . preg_replace('/[^0-9]/', '', $contacNumber);

                // Enviar mensaje
                $this->twilioService->sendWhatsappMessage($to, $message);

                // Actualizar que se envió el recordatorio
                $appointment->reminder_sent = true;
                $appointment->save();

                $count++;
            } catch (\Exception $e) {
                Log::error("Error enviando recordatorio WhatsApp: " . $e->getMessage());
            }
        }

        return $count;
    }
}
