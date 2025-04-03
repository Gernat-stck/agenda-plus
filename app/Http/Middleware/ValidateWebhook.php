<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ValidateWebhook
{
    public function handle(Request $request, Closure $next)
    {
        // Verifica IP del remitente (lista blanca de IPs del proveedor de pagos)
        $allowedIPs = explode(',', env('PAYMENT_PROVIDER_IPS', ''));

        if (!empty($allowedIPs) && !in_array($request->ip(), $allowedIPs)) {
            Log::warning('Intento de acceso a webhook desde IP no autorizada: ' . $request->ip());
            abort(403, 'Unauthorized IP');
        }

        // Puedes agregar otras validaciones básicas aquí

        return $next($request);
    }
}