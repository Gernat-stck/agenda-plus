<?php

namespace App\Http\Controllers;

use App\Models\Suscriptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SuscriptionsController extends Controller
{
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
        //TODO: Implementar la verificación del hash segun api key del aplicativo
        try {
            // Verificar el hash para seguridad (implementar según tu lógica específica)
            // if (!$this->verifyHash($validatedData)) {
            //     return response()->json(['message' => 'Hash inválido'], 400);
            // }

            // Obtener el usuario actual (ajustar según tu lógica de autenticación)
            $user = Auth::user();

            if (!$user) {
                Log::error('Usuario no autenticado intentando procesar pago', $validatedData);
                return response()->json(['message' => 'Usuario no autenticado'], 401);
            }

            // Verificar si ya existe este idTransaccion para evitar duplicados
            $existingSubscription = Suscriptions::where('id_account', $validatedData['idTransaccion'])->first();
            if ($existingSubscription) {
                return response()->json(['message' => 'Transacción ya procesada'], 200);
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

            return response()->json(['message' => 'Suscripción procesada con éxito'], 200);
        } catch (\Exception $e) {
            Log::error('Error al procesar pago', [
                'error' => $e->getMessage(),
                'data' => $validatedData
            ]);

            return response()->json(['message' => 'Error al procesar el pago'], 500);
        }
    }
}
