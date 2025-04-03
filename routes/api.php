<?php

use App\Http\Controllers\SubscriptionWebhookController;
use Illuminate\Support\Facades\Route;

// Rutas para webhooks sin middleware web
Route::post('webhook/wompi', [SubscriptionWebhookController::class, 'handleWompiWebhook']);