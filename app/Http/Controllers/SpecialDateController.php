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
    private function generateSpecialDateId($user_id)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . "DTE" . $randomNumber;
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'is_available' => 'required|boolean',
            'color' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);
        $validated['user_id'] = auth()->user()->user_id;
        $validated['specialdate_id'] = $this->generateSpecialDateId(auth()->user()->user_id);
        $specialDate = SpecialDate::create(array_merge($validated, [
            'specialdate_id' => $validated['specialdate_id'],
        ]));
        return redirect()->back()->with('success', `Día especial creado correctamente, codigo $specialDate->specialdate_id`);
    }

    public function update(Request $request, $id)
    {
        $specialDate = SpecialDate::where('specialdate_id', $id)->first();

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
        $specialDate = SpecialDate::where('specialdate_id', $id)->first();

        // Verificar que el usuario es el dueño del registro
        if ($specialDate->user_id !== auth()->user()->user_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $specialDate->delete();

        return redirect()->back()->with('success', 'Día especial eliminado correctamente');
    }
}