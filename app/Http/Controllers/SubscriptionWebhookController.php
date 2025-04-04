<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Invoice;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class SubscriptionWebhookController extends Controller
{
    /**
     * Maneja el webhook de suscripciones entrante de Wompi
     */
    public function handleWompiWebhook(Request $request)
    {
        // Registrar datos recibidos para depuración
        Log::info('Webhook de Wompi recibido: ' . json_encode($request->all()));

        try {
            // Extraer los datos necesarios del webhook según estructura de Wompi
            $webhookData = $request->all();

            // Datos básicos de la transacción
            $idTransaccion = $webhookData['IdTransaccion'] ?? null;
            $resultadoTransaccion = $webhookData['ResultadoTransaccion'] ?? null;
            $monto = $webhookData['Monto'] ?? 0;

            // Información del cliente (fundamental para identificar al usuario)
            $clienteEmail = $webhookData['cliente']['Email'] ?? null;

            // 1. Validar que tenemos los datos mínimos necesarios
            if (!$idTransaccion || !$resultadoTransaccion || !$clienteEmail) {
                Log::error('Webhook con datos insuficientes', $webhookData);
                return response()->json(['mensaje' => 'Datos insuficientes'], 200); // 200 para no causar reintentos
            }

            // 2. Evitar procesamiento duplicado //TODO: (Esto no esta funcionando correctamente, revisar)
            $existingInvoice = Invoice::where('transaction_data->IdTransaccion', $idTransaccion)->first();
            if ($existingInvoice) {
                Log::info("Transacción {$idTransaccion} ya procesada anteriormente");
                return response()->json(['mensaje' => 'Transacción ya procesada'], 200);
            }

            // 3. Identificar al usuario por su correo electrónico
            $user = User::where('email', $clienteEmail)->first();

            if (!$user) {
                Log::error("No se encontró usuario con email: {$clienteEmail}");
                return response()->json(['mensaje' => 'Usuario no encontrado'], 200); // 200 para no causar reintentos
            }

            // 4. Verificar si la transacción fue exitosa
            if ($resultadoTransaccion === 'ExitosaAprobada') {
                // Registrar la factura
                $invoice = new Invoice();
                $invoice->user_id = $user->user_id;
                $invoice->invoice_type = 'membresia';
                $invoice->amount = $monto;
                $invoice->payment_method = 'online';
                $invoice->status = 'pagado';
                $invoice->transaction_data = json_encode($webhookData);
                $invoice->save();

                // Buscar el plan según el monto
                $plan = SubscriptionPlan::where('price', $monto)->first();
                if (!$plan) {
                    // Si no se encuentra el plan exacto, usar el plan más básico
                    $plan = SubscriptionPlan::where('is_active', true)->orderBy('price', 'asc')->first();
                }

                // Verificar si existe la columna plan_id en la tabla subscriptions
                if (Schema::hasColumn('subscriptions', 'plan_id')) {
                    // Crear o actualizar la suscripción solo si existe la columna
                    $subscription = new Subscription();
                    $subscription->user_id = $user->user_id;
                    $subscription->plan_id = $plan->slug;
                    $subscription->subscription_plan_id = $idTransaccion; // Guardar el ID del plan
                    $subscription->status = 'active';
                    $subscription->approved = true;
                    $subscription->start_date = now();
                    $subscription->valid_until = now()->addMonth(); // Suscripción por un mes
                    $subscription->payment_method = 'online';
                    $subscription->last_payment_date = now();
                    $subscription->save();
                } else {
                    // Registrar que no se pudo guardar la suscripción debido a la falta de columna
                    Log::warning("No se pudo guardar la suscripción porque falta la columna plan_id. Ejecute la migración.");
                }

                // Actualizar el estado de membresía del usuario
                $user->membership_status = 'activo';
                $user->membership_expires_at = now()->addMonth(); // Un mes desde ahora
                $user->save();

                Log::info("Pago procesado exitosamente para el usuario {$user->email}");
                return response()->json(['mensaje' => 'Pago procesado correctamente'], 200);
            } else {
                // Transacción no exitosa, registrar pero no activar
                $invoice = new Invoice();
                $invoice->user_id = $user->user_id;
                $invoice->invoice_type = 'membresia';
                $invoice->amount = $monto;
                $invoice->payment_method = 'online';
                $invoice->status = 'fallido';
                $invoice->transaction_data = json_encode($webhookData);
                $invoice->save();

                Log::info("Pago fallido registrado para el usuario {$user->email}");
                return response()->json(['mensaje' => 'Pago fallido registrado'], 200);
            }
        } catch (\Exception $e) {
            Log::error('Error al procesar webhook: ' . $e->getMessage());
            return response()->json(['mensaje' => 'Error interno'], 200); // 200 para no causar reintentos
        }
    }
}