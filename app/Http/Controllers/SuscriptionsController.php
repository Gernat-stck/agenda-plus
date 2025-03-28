<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use App\Models\Suscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SuscriptionsController extends Controller
{
    /**
     * Verifica el hash de la transacción.
     *
     * @param array $data
     * @return bool
     */
    private function verifyHash($data)
    {
        // Obtener la API key correspondiente al comercio
        $apiKey = ApiKey::where('commerce_id', $data['identificadorEnlaceComercio'])
            ->where('active', true)
            ->value('api_key');

        if (!$apiKey) {
            Log::error('API key no encontrada para el comercio', [
                'commerce_id' => $data['identificadorEnlaceComercio']
            ]);
            return false;
        }

        // Reconstruir el hash con los datos + api key
        $expectedHash = hash('sha256', $data['idTransaccion'] . $data['monto'] . $apiKey);

        // Comparar con el hash recibido (usa hash_equals para prevenir timing attacks)
        return hash_equals($expectedHash, $data['hash']);
    }
    /**
     * Procesa el pago de una suscripción.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processPayment(Request $request)
    {
        // Validar los datos recibidos
        $validatedData = $request->validate([
            'identificadorEnlaceComercio' => 'required|string',
            'idTransaccion' => 'required|string',
            'idEnlace' => 'required|string',
            'monto' => 'required|numeric',
            'hash' => 'required|string',
        ]);
        DB::beginTransaction();
        try {
            // Verificar el hash para seguridad
            if (!$this->verifyHash($validatedData)) {
                Log::warning('Intento de pago con hash inválido', [
                    'data' => $validatedData,
                    'ip' => $request->ip()
                ]);
                return response()->json(['message' => 'Hash inválido'], 400);
            }

            // Obtener el usuario actual (ajustar según tu lógica de autenticación)
            $user = Auth::user();

            if (!$user) {
                DB::rollBack();
                Log::error('Usuario no autenticado intentando procesar pago', $validatedData);
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Verificar si ya existe este idTransaccion para evitar duplicados
            $existingSubscription = Suscriptions::where('id_account', $validatedData['idTransaccion'])->first();
            if ($existingSubscription) {
                DB::rollBack();
                return redirect()->route('home')->with('error', 'Esta transacción ya ha sido procesada.');
            }
            // Crear la suscripción
            $subscription = new Suscriptions();
            $subscription->user_id = $user->user_id;
            $subscription->package_name = $validatedData['identificadorEnlaceComercio'];
            $subscription->id_account = $validatedData['idTransaccion'];
            $subscription->date_transaction = Carbon::now()->toDateTimeString();
            $subscription->monto = $validatedData['monto'];
            $subscription->payment_method = 'webhook';
            $subscription->approved = true;
            // Podemos extender el modelo para guardar los demás campos como hash e idEnlace
            $subscription->save();

            // Actualizar el estado del usuario si es necesario
            // $user->update(['subscription_status' => 'active']);

            Log::info('Suscripción procesada correctamente', [
                'user_id' => $user->user_id,
                'subscription_id' => $subscription->id
            ]);
            DB::commit();
            return redirect()->route('home')->with('success', 'Suscripción procesada correctamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al procesar pago', [
                'error' => $e->getMessage(),
                'data' => $validatedData
            ]);

            return response()->json(['message' => 'Error al procesar el pago'], 500);
        }
    }
}
