<?php

namespace App\Http\Controllers;

use App\Services\AppointmentReminderService;
use Illuminate\Http\Request;

class ReminderController extends Controller
{
    protected $reminderService;

    public function __construct(AppointmentReminderService $reminderService)
    {
        $this->reminderService = $reminderService;
    }

    public function sendManualReminder(Request $request, $appointmentId)
    {
        // Buscar la cita específica y enviar recordatorio
        // Implementación...

        return response()->json(['success' => true, 'message' => 'Recordatorio enviado correctamente']);
    }

    public function sendBatchReminders(Request $request)
    {
        $hours = $request->input('hours', 24);
        $count = $this->reminderService->sendUpcomingReminders($hours);

        return response()->json([
            'success' => true,
            'message' => "Se enviaron {$count} recordatorios"
        ]);
    }
}
