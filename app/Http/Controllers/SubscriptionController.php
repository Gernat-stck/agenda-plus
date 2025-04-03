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
    public function processPayment(Request $request)
    {
        // Validar los datos recibidos del webhook
        $validator = Validator::make($request->all(), [
            'identificadorEnlaceComercio' => 'required|string',
            'idTransaccion' => 'required|string',
            'idEnlace' => 'required|string',
            'monto' => 'required|numeric',
            'hash' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validación de webhook fallida: ' . json_encode($validator->errors()));
            return response()->json(['message' => 'Datos de pago inválidos'], 400);
        }

        try {
            // Verificar la autenticación del usuario
            if (!Auth::check()) {
                // Si el usuario no está autenticado, buscar el usuario basado en algún identificador en el enlace
                // Por ejemplo, si tienes un token en la URL o un identificador de comercio que está vinculado a un usuario
                $user = User::where('some_identifier', $request->identificadorEnlaceComercio)->first();

                if (!$user) {
                    Log::error('Usuario no encontrado para el pago: ' . $request->identificadorEnlaceComercio);
                    return response()->json(['message' => 'Usuario no identificado'], 404);
                }
            } else {
                $user = Auth::user();
            }

            // Verificar si el hash es válido (implementa tu lógica de verificación)
            if (!$this->verifyHash($request->all())) {
                Log::error('Hash inválido para la transacción: ' . $request->idTransaccion);
                return response()->json(['message' => 'Hash de verificación inválido'], 400);
            }

            // Registrar la factura de la membresía
            $invoice = new Invoice();
            $invoice->user_id = $user->user_id;
            $invoice->invoice_type = 'membresia';
            $invoice->amount = $request->monto;
            $invoice->payment_method = 'online';
            $invoice->status = 'pagado';
            $invoice->transaction_data = json_encode($request->all());
            $invoice->save();

            // Actualizar el estado de membresía del usuario
            $user->membership_status = 'activo';

            // Establecer la fecha de expiración (por ejemplo, 30 días desde ahora)
            $user->membership_expires_at = Carbon::now()->addDays(30);
            $user->save();

            Log::info('Pago de membresía procesado correctamente: ' . $request->idTransaccion);
            return response()->json(['message' => 'Pago procesado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al procesar pago: ' . $e->getMessage());
            return response()->json(['message' => 'Error al procesar el pago: ' . $e->getMessage()], 500);
        }
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
     * Muestra la suscripción activa del usuario autenticado
     */
    public function current()
    {
        $user = Auth::user();
        $subscription = $this->getUserActiveSubscription($user);


        if (!$subscription) {
            return response()->json(['message' => 'No tienes una suscripción activa'], 404);
        }

        $subscription->load('plan.features');

        return response()->json([
            'subscription' => $subscription,
            'plan' => $subscription->plan->toFrontendFormat(),
            'valid_until' => $subscription->valid_until,
            'status' => $subscription->status,
        ]);
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
