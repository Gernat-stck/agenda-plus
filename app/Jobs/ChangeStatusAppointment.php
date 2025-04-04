<?php

namespace App\Jobs;

use App\Models\Appointments;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ChangeStatusAppointment implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * El tiempo (en segundos) después del cual se liberará el bloqueo de unicidad.
     *
     * @var int
     */
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct() {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $ahora = Carbon::now();

        // Actualizar a "finalizado" las citas que ya pasaron su hora de fin
        $finalizadas = Appointments::where('status', '!=', 'finalizado')
            ->where('end_time', '<', $ahora)
            ->update(['status' => 'finalizado']);

        Log::info("Citas finalizadas: $finalizadas");

        // Actualizar a "en curso" las citas que están dentro de su intervalo de tiempo
        $enCurso = Appointments::where('status', '!=', 'en curso')
            ->where('status', '!=', 'finalizado')
            ->where('start_time', '<=', $ahora)
            ->where('end_time', '>', $ahora)
            ->update(['status' => 'en curso']);

        Log::info("Citas actualizadas a En Curso: $enCurso");
    }
}
