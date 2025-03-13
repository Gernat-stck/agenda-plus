<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ClientController;
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
        Route::delete('appointments/calendar/{appointment}', [CalendarController::class, 'destroy'])->name('calendar.destroyCalendar');
    }

);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
