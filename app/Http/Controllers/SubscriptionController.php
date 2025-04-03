<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\PaymentTransaction;
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
     * Maneja los webhooks entrantes del proveedor de pagos
     * Esta función procesa las notificaciones asíncronas enviadas por el proveedor de pagos
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleWebhook(\Illuminate\Http\Request $request)
    {
        // Registrar la solicitud webhook para depuración
        Log::info('Webhook recibido: ' . json_encode($request->all()));

        // Verificar la firma/autenticidad del webhook
        if (!$this->validateWebhookSignature($request)) {
            Log::error('Firma de webhook inválida');
            return response()->json(['message' => 'Firma inválida'], 401);
        }

        try {
            // Extraer datos del webhook (ajustar según la estructura del proveedor de pagos)
            $webhookData = $request->all();
            $idTransaccion = $webhookData['idTransaccion'] ?? null;
            $status = $webhookData['estado'] ?? 'desconocido';
            $idEnlace = $webhookData['idEnlace'] ?? null;
            $monto = $webhookData['monto'] ?? 0;
            $identificadorEnlaceComercio = $webhookData['identificadorEnlaceComercio'] ?? null;

            // Verificar si la transacción ya ha sido procesada para evitar duplicados
            $existingInvoice = Invoice::where('transaction_data->idTransaccion', $idTransaccion)
                ->first();

            if ($existingInvoice) {
                Log::info("Transacción {$idTransaccion} ya procesada anteriormente");
                return response()->json(['message' => 'Transacción ya procesada'], 200);
            }

            // Identificar al usuario relacionado con esta transacción
            // Esto dependerá de cómo tu sistema vincule los pagos con los usuarios
            $user = null;

            // Opción 1: Si el identificador del enlace de comercio contiene el ID del usuario
            if ($identificadorEnlaceComercio) {
                // Extraer userId del identificador (ajustar según tu implementación)
                $userId = $this->extractUserIdFromIdentifier($identificadorEnlaceComercio);
                $user = User::where('user_id', $userId)->first();
            }

            // Opción 2: Buscar por idEnlace si el sistema lo utiliza para asociar usuarios
            if (!$user && $idEnlace) {
                $user = User::where('payment_link_id', $idEnlace)->first();
            }

            if (!$user) {
                Log::error("No se pudo identificar al usuario para la transacción {$idTransaccion}");
                return response()->json(['message' => 'Usuario no identificado'], 404);
            }

            // Procesar según el estado de la transacción
            switch ($status) {
                case 'exitoso':
                case 'pagado':
                case 'completado':
                    // Crear factura para el pago exitoso
                    $invoice = new Invoice();
                    $invoice->user_id = $user->user_id;
                    $invoice->invoice_type = 'membresia';
                    $invoice->amount = $monto;
                    $invoice->payment_method = 'online';
                    $invoice->status = 'pagado';
                    $invoice->transaction_data = json_encode($webhookData);
                    $invoice->save();

                    // Identificar el plan de suscripción basado en el monto o datos adicionales
                    $plan = $this->identifySubscriptionPlan($monto, $webhookData);

                    // Actualizar o crear suscripción
                    $subscription = new Subscription();
                    $subscription->user_id = $user->id;
                    $subscription->plan_id = $plan->id;
                    $subscription->status = 'active';
                    $subscription->start_date = now();
                    $subscription->valid_until = $this->calculateValidUntil($plan->billing_period);
                    $subscription->payment_method = 'online';
                    $subscription->last_payment_date = now();
                    $subscription->save();

                    // Actualizar el estado de membresía del usuario
                    $user->membership_status = 'activo';
                    $user->membership_expires_at = $subscription->valid_until;
                    $user->save();

                    // Enviar notificación al usuario
                    $this->notifySuccessfulPayment($user, $invoice);

                    Log::info("Pago exitoso procesado: {$idTransaccion} para usuario {$user->user_id}");
                    break;

                case 'fallido':
                case 'rechazado':
                case 'error':
                    // Registrar la transacción fallida
                    $invoice = new Invoice();
                    $invoice->user_id = $user->user_id;
                    $invoice->invoice_type = 'membresia';
                    $invoice->amount = $monto;
                    $invoice->payment_method = 'online';
                    $invoice->status = 'fallido';
                    $invoice->transaction_data = json_encode($webhookData);
                    $invoice->save();

                    // Notificar al usuario sobre el fallo en el pago
                    $this->notifyFailedPayment($user, $webhookData);

                    Log::warning("Pago fallido: {$idTransaccion} para usuario {$user->user_id}");
                    break;

                case 'pendiente':
                    // Registrar transacción pendiente
                    $invoice = new Invoice();
                    $invoice->user_id = $user->user_id;
                    $invoice->invoice_type = 'membresia';
                    $invoice->amount = $monto;
                    $invoice->payment_method = 'online';
                    $invoice->status = 'pendiente';
                    $invoice->transaction_data = json_encode($webhookData);
                    $invoice->save();

                    Log::info("Pago pendiente registrado: {$idTransaccion} para usuario {$user->user_id}");
                    break;

                default:
                    Log::warning("Estado de pago desconocido: {$status} para transacción {$idTransaccion}");
                    return response()->json(['message' => 'Estado de transacción no reconocido'], 200);
            }

            return response()->json(['message' => 'Webhook procesado correctamente'], 200);
        } catch (\Exception $e) {
            Log::error('Error al procesar webhook: ' . $e->getMessage());
            // Devolver 200 para que el proveedor no reintente
            return response()->json(['message' => 'Error al procesar webhook'], 200);
        }
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
     * Extrae el ID del usuario del identificador del enlace comercial
     */
    private function extractUserIdFromIdentifier($identifier)
    {
        // Implementa la lógica para extraer el ID del usuario del identificador
        // Por ejemplo, si el formato es "payment-{userId}-{timestamp}"
        // 
        // $parts = explode('-', $identifier);
        // return $parts[1] ?? null;

        // Simplificado para desarrollo
        return $identifier;
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
