<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
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
     * Inicia el proceso de suscripción a un plan
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'payment_method' => 'required|string',
            // Otros campos necesarios para el procesamiento del pago
        ]);

        $user = Auth::user();
        $plan = SubscriptionPlan::findOrFail($validated['plan_id']);

        // 1. Procesar pago (integración con tu gateway de pagos)
        // Este es un ejemplo simplificado
        $paymentSuccessful = $this->processPayment($validated['payment_method'], $plan->price);

        if (!$paymentSuccessful) {
            return response()->json(['message' => 'Error al procesar el pago'], 400);
        }

        // 2. Crear transacción
        $transaction = PaymentTransaction::create([
            'user_id' => $user->id,
            'amount' => $plan->price,
            'currency' => 'USD', // Ajustar según tu aplicación
            'payment_method' => $validated['payment_method'],
            'status' => 'completed',
            'transaction_id' => 'trans_' . uniqid(), // Deberías obtener esto del gateway
        ]);

        // 3. Calcular fecha de vencimiento basada en el período
        $validUntil = $this->calculateValidUntil($plan->period);

        // 4. Crear o actualizar suscripción
        $subscription = Subscription::updateOrCreate(
            ['user_id' => $user->id, 'status' => 'active'],
            [
                'subscription_plan_id' => $plan->id,
                'valid_until' => $validUntil,
                'status' => 'active',
            ]
        );

        // 5. Asociar transacción con suscripción
        $transaction->subscription_id = $subscription->id;
        $transaction->save();

        return response()->json([
            'message' => 'Suscripción activada correctamente',
            'subscription' => $subscription->load('plan'),
            'transaction' => $transaction,
        ], 201);
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
     * Procesa un pago (ejemplo)
     */
    private function processPayment($paymentMethod, $amount)
    {
        // Integrar con tu gateway de pagos (Stripe, PayPal, etc.)
        // Este es solo un ejemplo de retorno
        return true;
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
}
