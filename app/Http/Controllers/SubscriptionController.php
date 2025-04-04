<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Invoice;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->with('features')
            ->get()
            ->map->toFrontendFormat();

        return Inertia::render('Membership/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Verifica que el hash recibido sea válido
     */
    private function verifyHash($data)
    {
        // Implementar lógica de verificación del hash según el proveedor de pagos
        // Ejemplo: 
        // $expectedHash = hash('sha256', $data['idTransaccion'] . $data['monto'] . env('PAYMENT_SECRET'));
        // return $expectedHash === $data['hash'];

        // Por ahora, asumimos que el hash es válido para desarrollo
        return true;
    }
    /**
     * Obtiene la suscripción activa del usuario
     */
    private function getUserActiveSubscription($user)
    {
        return Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhere('valid_until', '>', now());
            })
            ->latest()
            ->first();
    }

    /**
     * Verifica el estado de la suscripción tras un pago
     */
    public function verifySubscription(\Illuminate\Http\Request $request)
    {
        try {
            // Validar los datos mínimos de la transacción
            $validator = Validator::make($request->all(), [
                'idTransaccion' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Datos de verificación inválidos'
                ], 400);
            }

            // Obtener el usuario autenticado
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'inactive',
                    'message' => 'Usuario no autenticado'
                ], 401);
            }
            $transactionId = $request->input('idTransaccion');
            // OPCIÓN 1: VERIFICAR DIRECTAMENTE SI EXISTE UNA SUSCRIPCIÓN CON ESA TRANSACCIÓN
            // Verificar si hay una suscripción asociada a esta transacción y que esté activa
            $subscription = Subscription::where('subscription_plan_id', $transactionId)
                ->where('user_id', $user->user_id)
                ->where('status', 'active')
                ->where('approved', true)
                ->first();
            Log::info('suscripcion' . Subscription::where('subscription_plan_id', $transactionId)->where('user_id', $user->id)
                ->first());
            if ($subscription) {
                return response()->json([
                    'status' => 'active',
                    'message' => 'Suscripción activa',
                    'subscription' => [
                        'plan_name' => $subscription->plan->name ?? 'Plan',
                        'valid_until' => $subscription->valid_until
                    ]
                ]);
            }

            // OPCIÓN 2: VERIFICAR SI EL USUARIO TIENE CUALQUIER SUSCRIPCIÓN ACTIVA
            // Si no encontramos una suscripción con esa transacción, verificamos si el usuario tiene otra activa
            $activeSubscription = $user->activeSubscription();
            if ($activeSubscription) {
                return response()->json([
                    'status' => 'active',
                    'message' => 'Suscripción activa',
                    'subscription' => [
                        'plan_name' => $activeSubscription->plan->name ?? 'Plan',
                        'valid_until' => $activeSubscription->valid_until
                    ]
                ]);
            }

            // OPCIÓN 3: VERIFICAR SI HAY UNA SUSCRIPCIÓN PENDIENTE CON ESA TRANSACCIÓN
            // Buscar una suscripción con el ID de transacción pero en estado no activo
            $pendingSubscription = Subscription::where('subscription_plan_id', $transactionId)
                ->where('user_id', $user->id)
                ->where('status', '!=', 'active')
                ->first();

            if ($pendingSubscription) {
                return response()->json([
                    'status' => 'pending',
                    'message' => 'Su suscripción está siendo procesada'
                ]);
            }

            // OPCIÓN 4: VERIFICAR SI HAY UNA FACTURA PAGADA PARA ESA TRANSACCIÓN
            // Verificar si hay una factura relacionada con la transacción
            $invoice = Invoice::where('transaction_data->idTransaccion', $transactionId)
                ->orWhere('transaction_data->IdTransaccion', $transactionId)
                ->first();

            if ($invoice && $invoice->status === 'paid') {
                return response()->json([
                    'status' => 'pending',
                    'message' => 'Su pago ha sido registrado y está siendo procesado'
                ]);
            } elseif ($invoice && $invoice->status === 'failed') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'La transacción no fue procesada correctamente'
                ]);
            }

            // Si no hay registro, significa que el webhook aún no ha procesado el pago
            return response()->json([
                'status' => 'pending',
                'message' => 'Verificando estado del pago'
            ]);

        } catch (\Exception $e) {
            Log::error('Error al verificar suscripción: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error interno al verificar la suscripción',
                'details' => app()->environment('local') ? $e->getMessage() : null
            ], 500);
        }
    }
    /**
     * Cancela la suscripción activa del usuario
     */
    public function cancel()
    {
        $user = Auth::user();
        $subscription = $this->getUserActiveSubscription($user);


        if (!$subscription) {
            return response()->json(['message' => 'No tienes una suscripción activa para cancelar'], 404);
        }

        $subscription->status = 'cancelled';
        $subscription->save();

        return response()->json([
            'message' => 'Tu suscripción ha sido cancelada',
            'subscription' => $subscription,
        ]);
    }

    /**
     * Calcula la fecha de vencimiento basada en el período
     */
    private function calculateValidUntil($period)
    {
        $now = Carbon::now();

        return match ($period) {
            'monthly' => $now->addMonth(),
            'quarterly' => $now->addMonths(3),
            'semiannual' => $now->addMonths(6),
            'yearly' => $now->addYear(),
            default => $now->addMonth(),
        };
    }

    /**
     * Valida la firma del webhook para verificar su autenticidad
     */
    private function validateWebhookSignature(\Illuminate\Http\Request $request)
    {
        // Implementar la validación según el proveedor de pagos
        // Por ejemplo, para muchos proveedores:
        // 1. Obtener la firma del encabezado
        // $signature = $request->header('X-Payment-Signature');
        // 
        // 2. Calcular la firma esperada
        // $payload = $request->getContent();
        // $calculatedSignature = hash_hmac('sha256', $payload, env('PAYMENT_WEBHOOK_SECRET'));
        // 
        // 3. Comparar
        // return hash_equals($calculatedSignature, $signature);

        // Por ahora, en desarrollo aceptamos todos los webhooks
        return true;
    }

    /**
     * Identifica el plan de suscripción basado en el monto y datos adicionales
     */
    private function identifySubscriptionPlan($amount, $webhookData)
    {
        // Buscar el plan por monto
        $plan = SubscriptionPlan::where('price', $amount)->first();

        // Si no se encuentra por monto, buscar por referencia en datos adicionales
        if (!$plan && isset($webhookData['planReference'])) {
            $plan = SubscriptionPlan::where('reference_code', $webhookData['planReference'])->first();
        }

        // Si aún no se encuentra, usar el plan más básico
        if (!$plan) {
            $plan = SubscriptionPlan::where('is_active', true)->orderBy('price', 'asc')->first();
        }

        return $plan;
    }

    /**
     * Envía una notificación al usuario sobre un pago exitoso
     */
    private function notifySuccessfulPayment($user, $invoice)
    {
        // Implementar notificaciones (email, SMS, etc.)
        // Ejemplo: Mail::to($user->email)->send(new PaymentSuccessful($invoice));

        // Por ahora solo registramos en el log
        Log::info("Se enviaría notificación de pago exitoso al usuario {$user->email}");
    }

    /**
     * Envía una notificación al usuario sobre un pago fallido
     */
    private function notifyFailedPayment($user, $paymentData)
    {
        // Implementar notificaciones (email, SMS, etc.)
        // Ejemplo: Mail::to($user->email)->send(new PaymentFailed($paymentData));

        // Por ahora solo registramos en el log
        Log::info("Se enviaría notificación de pago fallido al usuario {$user->email}");
    }

}
