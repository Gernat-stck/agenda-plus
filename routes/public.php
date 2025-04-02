<?php

use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;


// Rutas públicas - Sin middleware de validación de membresía
Route::get('/', [PublicController::class, 'index'])->name('home');

// Rutas públicas para agendar citas
Route::get('/book/{userId?}', [PublicController::class, 'showRegistrationForm'])->name('appointments.book');
Route::post('/book/appointments', [PublicController::class, 'storeAppointment'])->name('appointments.public.store');
Route::get('/book/appointments/slots/{date}/{userId}', [PublicController::class, 'getAvailableSlots'])->name('appointments.public.slots');
Route::get('/appointments/confirmation/{appointment_id}', [PublicController::class, 'showConfirmation'])->name('appointments.confirmation');
