<?php

namespace App\Http\Controllers;

use App\Models\Appointments;
use App\Models\Client;
use App\Models\ClientsUser;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function getDashboardStats()
    {
        $user = Auth::user();
        $userId = $user->user_id;
        // Configurar la zona horaria apropiada (ajusta esto a tu zona horaria)
        $timezone = config('app.timezone', 'America/Mexico_City');

        // Crear fechas con zona horaria explícita
        $today = Carbon::today($timezone);
        $tomorrow = Carbon::tomorrow($timezone);
        $thisMonth = Carbon::now($timezone)->startOfMonth();
        $nextMonth = Carbon::now($timezone)->addMonth()->startOfMonth();
        $lastWeek = Carbon::now($timezone)->subWeek();
        $yesterday = Carbon::yesterday($timezone);
        // Citas para hoy
        $todayAppointments = Appointments::where('appointments.user_id', $userId)
            ->whereDate('appointments.start_time', $today)
            ->count();

        // Citas para mañana
        $tomorrowAppointments = Appointments::where('appointments.user_id', $userId)
            ->whereDate('appointments.start_time', $tomorrow)
            ->count();

        // Ingresos de este mes (basado en citas finalizados)
        $monthlyRevenue = Appointments::where('appointments.user_id', $userId)
            ->where('appointments.status', 'finalizado')
            ->whereBetween('appointments.start_time', [$thisMonth, $nextMonth])
            ->join('services', 'appointments.service_id', '=', 'services.service_id')
            ->sum('services.price');
        // Ingresos de la semana pasada (basado en citas finalizados)
        $weeklyRevenue = Appointments::where('appointments.user_id', $userId)
            ->where('appointments.status', 'finalizado')
            ->whereBetween('appointments.start_time', [$lastWeek, $today])
            ->join('services', 'appointments.service_id', '=', 'services.service_id')
            ->sum('services.price');
        // Ingresos de hoy (basado en citas finalizados)
        $todayRevenue = Appointments::where('appointments.user_id', $userId)
            ->where('appointments.status', 'finalizado')
            ->whereDate('appointments.start_time', $today)
            ->join('services', 'appointments.service_id', '=', 'services.service_id')
            ->sum('services.price');

        $newClients = ClientsUser::where('clients_user.user_id', $userId)
            ->whereDate('clients_user.created_at', $today)
            ->count();
        $clientsLastWeek = ClientsUser::where('clients_user.user_id', $userId)
            ->whereBetween('clients_user.created_at', [$lastWeek, $yesterday])
            ->count();
        $monthlyChartData = $this->getMonthlyAppointmentsData($userId);

        // Obtener datos para los diferentes timeframes
        $monthlyData = $this->getMonthlyAppointmentsData($userId);
        $weeklyData = $this->getWeeklyAppointmentsData($userId);
        $dailyData = $this->getDailyAppointmentsData($userId);

        return ([
            'today_appointments' => $todayAppointments,
            'tomorrow_appointments' => $tomorrowAppointments,
            'monthly_revenue' => $monthlyRevenue,
            'new_clients' => $newClients,
            'clients_last_week' => $clientsLastWeek,
            'weekly_revenue' => $weeklyRevenue,
            'today_revenue' => $todayRevenue,
            'total_clients' => Client::whereIn('client_id', ClientsUser::where('user_id', $userId)->pluck('client_id'))->count(),
            'chart_data' => [
                'monthly' => $monthlyData,
                'weekly' => $weeklyData,
                'daily' => $dailyData
            ]
        ]);
    }

    // Datos mensuales (últimos 12 meses)
    private function getMonthlyAppointmentsData($userId)
    {
        $chartData = [];
        $today = Carbon::now();
        $monthsInSpanish = [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic'
        ];

        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $startOfMonth = $month->copy()->startOfMonth();
            $endOfMonth = $month->copy()->endOfMonth();

            // Contar citas para este mes
            $appointmentsCount = Appointments::where('user_id', $userId)
                ->whereBetween('start_time', [$startOfMonth, $endOfMonth])
                ->count();

            $chartData[] = [
                'date' => $monthsInSpanish[$month->month - 1], // Usar nombre en español
                'value' => $appointmentsCount
            ];
        }

        return $chartData;
    }

    // Datos diarios (últimos 7 días)
    private function getDailyAppointmentsData($userId)
    {
        $chartData = [];
        $today = Carbon::now();

        // Nombres de días en español
        $daysInSpanish = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

        // Datos para los últimos 7 días
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::now()->subDays($i);
            $startOfDay = $day->copy()->startOfDay();
            $endOfDay = $day->copy()->endOfDay();

            $appointmentsCount = Appointments::where('user_id', $userId)
                ->whereBetween('start_time', [$startOfDay, $endOfDay])
                ->count();

            $chartData[] = [
                'date' => $daysInSpanish[$day->dayOfWeek] . ' ' . $day->format('d'),
                'value' => $appointmentsCount
            ];
        }

        return $chartData;
    }

    // Datos semanales (últimas 4 semanas)
    private function getWeeklyAppointmentsData($userId)
    {
        $chartData = [];

        // Datos para las últimas 4 semanas
        for ($i = 3; $i >= 0; $i--) {
            $weekStart = Carbon::now()->subWeeks($i)->startOfWeek();
            $weekEnd = Carbon::now()->subWeeks($i)->endOfWeek();

            $appointmentsCount = Appointments::where('user_id', $userId)
                ->whereBetween('start_time', [$weekStart, $weekEnd])
                ->count();

            $chartData[] = [
                'date' => 'Sem ' . $weekStart->format('d/m') . '-' . $weekEnd->format('d/m'),
                'value' => $appointmentsCount
            ];
        }

        return $chartData;
    }
}
