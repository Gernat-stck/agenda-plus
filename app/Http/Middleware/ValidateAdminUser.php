<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ValidateAdminUser
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
        // Asumimos que el usuario ya está autenticado por el middleware 'auth'
        $user = Auth::user();

        // Solo verifica el estado de la membresía
        if ($user->role !== 'admin') {
            return redirect()->route('dashboard')->with('error', 'Necesitas ser administrador.');
        }

        return $next($request);
    }
}
