<?php

namespace App\Console\Commands;

use App\Services\AppointmentReminderService;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders {hours=24}';
    protected $description = 'Envía recordatorios de WhatsApp para citas próximas';

    public function handle(AppointmentReminderService $reminderService)
    {
        $hours = $this->argument('hours');
        $this->info("Enviando recordatorios para citas en las próximas {$hours} horas...");

        $count = $reminderService->sendUpcomingReminders($hours);

        $this->info("Proceso completado. Se enviaron {$count} recordatorios.");

        return Command::SUCCESS;
    }
}
