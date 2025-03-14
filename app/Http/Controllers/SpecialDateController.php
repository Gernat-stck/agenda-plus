<?php

namespace App\Http\Controllers;

use App\Models\SpecialDate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialDateController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->user_id;
        $specialDates = SpecialDate::where('user_id', $userId)->get();

        return response()->json($specialDates);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'is_available' => 'boolean',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->user()->user_id;

        $specialDate = SpecialDate::create($validated);

        return redirect()->back()->with('success', 'Día especial creado correctamente');
    }

    public function update(Request $request, $id)
    {
        $specialDate = SpecialDate::findOrFail($id);

        // Verificar que el usuario es el dueño del registro
        if ($specialDate->user_id !== auth()->user()->user_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'date' => 'date',
            'is_available' => 'boolean',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $specialDate->update($validated);

        return redirect()->back()->with('success', 'Día especial actualizado correctamente');
    }

    public function destroy($id)
    {
        $specialDate = SpecialDate::findOrFail($id);

        // Verificar que el usuario es el dueño del registro
        if ($specialDate->user_id !== auth()->user()->user_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $specialDate->delete();

        return redirect()->back()->with('success', 'Día especial eliminado correctamente');
    }
}