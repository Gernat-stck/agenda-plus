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
        // Evitar bucle infinito: no aplicar este middleware a la ruta membership.required
        if ($request->routeIs('membership.required')) {
            return $next($request);
        }

        // Verifica si el usuario está autenticado.
        if (!Auth::check()) {
            // Usuario no autenticado, redirige a la ruta de login.
            return redirect()->route('login')->with('error', 'Debes iniciar sesión para acceder a esta área.');
        }

        $user = Auth::user();

        // Si el usuario no tiene una membresía activa, redirige a una ruta específica.
        if ($user->membership_status == 'inactivo') {
            return redirect()->route('membership.required')->with('error', 'Debes ser usuario premium.');
        }

        return $next($request);
    }
}
