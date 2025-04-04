<?php

namespace App\Http\Controllers;

use App\Models\PlanFeature;
use App\Models\SubscriptionPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SubscriptionPlanController extends Controller
{
    /**
     * Muestra todos los planes de suscripción activos
     */
    public function index()
    {
        $plans = SubscriptionPlan::where('is_active', true)
            ->with('features')
            ->get()
            ->map->toFrontendFormat();

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Muestra un plan específico
     */
    public function show(SubscriptionPlan $plan)
    {
        $plan->load('features');
        return response()->json($plan->toFrontendFormat());
    }

    /**
     * Almacena un nuevo plan usando transacciones
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'period' => 'required|string',
            'highlight' => 'boolean',
            'badge' => 'nullable|array',
            'badge.text' => 'nullable|string',
            'badge.variant' => 'nullable|string',
            'buttonText' => 'required|string',
            'buttonVariant' => 'required|string',
            'features' => 'array',
            'paymentWidget' => 'nullable|string', // URL de pago de Wompi
        ]);


        try {
            return DB::transaction(function () use ($validated) {
                // Crear el plan
                $plan = SubscriptionPlan::create([
                    'name' => $validated['title'],
                    'slug' => Str::slug($validated['title']),
                    'description' => $validated['description'],
                    'price' => $validated['price'],
                    'period' => $validated['period'],
                    'is_highlighted' => $validated['highlight'] ?? false,
                    'badge_text' => $validated['badge']['text'] ?? null,
                    'badge_variant' => $validated['badge']['variant'] ?? null,
                    'button_text' => $validated['buttonText'],
                    'button_variant' => $validated['buttonVariant'],
                    'payment_url' => $validated['paymentWidget'] ?? null,
                ]);

                // Guardar las características del plan
                if (isset($validated['features'])) {
                    foreach ($validated['features'] as $feature) {
                        PlanFeature::create([
                            'plan_id' => $plan->id,
                            'text' => $feature['text'] ?? null,
                            'included' => $feature['included'] ?? true,
                            'icon' => $feature['icon'] ?? null,
                        ]);
                    }
                }
                return redirect()->route('admin.plans.index')
                    ->with('success', 'Plan creado exitosamente.');
            });
        } catch (\Exception $e) {
            // Mejor manejo de excepciones (quita el dd() en producción)
            Log::error('Error al crear plan: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al crear el plan: ' . $e->getMessage());
        }
    }
    /**
     * Actualiza un plan existente usando transacciones
     */
    public function update(Request $request, SubscriptionPlan $plan)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'period' => 'string',
            'highlight' => 'boolean',
            'badge' => 'nullable|array',
            'badge.text' => 'nullable|string',
            'badge.variant' => 'nullable|string',
            'buttonText' => 'string',
            'buttonVariant' => 'string',
            'features' => 'array',
            'paymentWidget' => 'nullable|string',
        ]);
        try {
            return DB::transaction(function () use ($validated, $plan) {
                // Actualizar el plan
                $plan->update([
                    'name' => $validated['title'] ?? $plan->name,
                    'slug' => Str::slug($validated['title'] ?? $plan->name),
                    'description' => $validated['description'] ?? $plan->description,
                    'price' => $validated['price'] ?? $plan->price,
                    'period' => $validated['period'] ?? $plan->period,
                    'is_highlighted' => $validated['highlight'] ?? $plan->is_highlighted,
                    'badge_text' => $validated['badge']['text'] ?? null,
                    'badge_variant' => $validated['badge']['variant'] ?? null,
                    'button_text' => $validated['buttonText'] ?? $plan->button_text,
                    'button_variant' => $validated['buttonVariant'] ?? $plan->button_variant,
                    'payment_url' => $validated['paymentWidget'] ?? null,
                ]);

                // Actualizar las características del plan
                if (isset($validated['features'])) {
                    PlanFeature::where('plan_id', $plan->id)->delete();
                    foreach ($validated['features'] as $feature) {
                        PlanFeature::create([
                            'plan_id' => $plan->id,
                            'text' => $feature['text'] ?? null,
                            'included' => $feature['included'] ?? true,
                            'icon' => $feature['icon'] ?? null,
                        ]);
                    }
                }

                return redirect()->route('admin.plans.index')
                    ->with('success', 'Plan actualizado exitosamente.');
            });
        } catch (\Exception $e) {
            Log::error('Error al actualizar plan: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'Error al actualizar el plan: ' . $e->getMessage());
        }
    }

    /**
     * Elimina un plan
     */
    public function destroy(SubscriptionPlan $plan)
    {
        try {
            return DB::transaction(function () use ($plan) {
                // Eliminar las características asociadas
                PlanFeature::where('plan_id', $plan->id)->delete();

                // Eliminar el plan
                $plan->delete();

                return response()->noContent();
            });
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el plan: ' . $e->getMessage()], 500);
        }
    }
}
