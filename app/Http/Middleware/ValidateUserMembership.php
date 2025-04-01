<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateUserMembership
{
    /**
     * Maneja la petición entrante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Evitar bucle infinito
        if ($request->routeIs('membership.required')) {
            return $next($request);
        }
        // Asumimos que el usuario ya está autenticado por el middleware 'auth'
        $user = Auth::user();

        // Solo verifica el estado de la membresía
        if ($user->membership_status == 'inactivo') {
            return redirect()->route('membership.required')->with('error', 'Debes ser usuario premium.');
        }

        return $next($request);
    }
}
