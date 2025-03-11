<?php

use App\Http\Controllers\AppointmentController;
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
        Route::get('services/category', [ServiceController::class, 'category'])->name('services.category');
        //Clients
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('clients/create', [ClientController::class, 'store'])->name('clients.store');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
        Route::patch('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::post('clients/attach-user', [ClientController::class, 'attachUser'])->name('clients.attachUser');
        Route::post('clients/detach-user', [ClientController::class, 'detachUser'])->name('clients.detachUser');
        Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

        //Appointments
        Route::get('appointments', [AppointmentController::class, 'index'])->name('appointments.index');
        Route::post('appointments', [AppointmentController::class, 'store'])->name('appointments.store');
        Route::post('appointments/client', [AppointmentController::class, 'storeClientsPage'])->name('appointments.clientattach');
        Route::get('appointments/{appointment}', [AppointmentController::class, 'show'])->name('appointments.show');
        Route::patch('appointments/{appointment}', [AppointmentController::class, 'update'])->name('appointments.update');
        Route::delete('appointments/{appointment}', [AppointmentController::class, 'destroy'])->name('appointments.destroy');
    }

);

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
