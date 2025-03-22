<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SpecialDateController;
use App\Http\Controllers\WhatsappController;
use App\Http\Controllers\WhatsappWebhookController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(
    function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');
        Route::get('calendar', function () {
            return Inertia::render('calendar');
        })->name('calendar');
        Route::get('clients', function () {
            return Inertia::render('clients');
        })->name('clients');
        Route::get('calendar/config', function () {
            return Inertia::render('calendar/config');
        })->name('calendar.config');

        //Services
        Route::get('services', [ServiceController::class, 'index'])->name('services.index');
        Route::post('services', [ServiceController::class, 'store'])->name('services.store');
        Route::patch('services/{service}', [ServiceController::class, 'update'])->name('services.update');
        Route::delete('services/{service}', [ServiceController::class, 'destroy'])->name('services.destroy');

        //Clients
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('clients/create', [ClientController::class, 'store'])->name('clients.store');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
        Route::patch('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');
        Route::post('appointments/client', [ClientController::class, 'storeClientsAppointments'])->name('clients.storeAppointments');
        Route::delete('appointments/client/{appointment}', [ClientController::class, 'destroyClientsAppointments'])->name('appointments.destroy.clients');
        Route::patch('appointments/{appointment}', [ClientController::class, 'update'])->name('appointments.update.clients');

        //Appointments
        Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
        Route::patch('appointments/{appointment}', [AppointmentController::class, 'update'])->name('appointments.update');
        Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])->name('appointments.destroy');

        //Calendar
        Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');
        Route::post('appointments', [CalendarController::class, 'store'])->name('appointments.store');
        Route::patch('appointments/calendar/{appointment}', [CalendarController::class, 'updateAppointment'])->name('appointments.update');
        Route::delete('appointments/calendar/{appointment}', [CalendarController::class, 'destroy'])->name('calendar.destroyCalendar');
        Route::get('calendar/config', [CalendarController::class, 'configIndex'])->name('calendar.config');
        Route::post('calendar/config', [CalendarController::class, 'saveConfig'])->name('calendar.config.save');
        // Rutas para días especiales
        Route::post('special-dates', [SpecialDateController::class, 'store'])->name('special-dates.store');
        Route::patch('special-dates/{id}', [SpecialDateController::class, 'update'])->name('special-dates.update');
        Route::delete('special-dates/{id}', [SpecialDateController::class, 'destroy'])->name('special-dates.destroy');
        // Rutas para configuración de WhatsApp
        Route::resource('whatsapp-configurations', WhatsappController::class);
        Route::post('whatsapp-configurations/{configuration}/connect', [WhatsappController::class, 'connect'])->name('whatsapp-configurations.connect');
        Route::post('whatsapp-configurations/{configuration}/disconnect', [WhatsappController::class, 'disconnect'])->name('whatsapp-configurations.disconnect');

        // Ruta para enviar mensajes
        Route::post('whatsapp/send', [WhatsappController::class, 'sendTestMessage']);

        // Ruta para recibir webhooks de Twilio (por ejemplo, actualizaciones de estado de mensaje)
        Route::post('whatsapp/webhook', [WhatsappWebhookController::class, 'handleWebhook']);
        Route::get('register/appointment/link', [AppointmentController::class, 'appointmentRegisterLink'])->name('appointment.register.link');
        Route::get('appointments/date/{date}', [AppointmentController::class, 'getAppointmentsByDate']);
        Route::get('available/slots/{date}', [CalendarController::class, 'getAvailableSlots']);
    }

);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/public.php';