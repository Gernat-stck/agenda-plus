<?php
namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric',
            'duracion' => 'required|integer',
            'categoria' => 'required|string|max:255',
        ]);

        Service::create($request->all());

        return redirect()->route('services.index')->with('success', 'Servicio creado correctamente.');
    }

    public function update(Request $request, Service $service)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric',
            'duracion' => 'required|integer',
            'categoria' => 'required|string|max:255',
        ]);

        $service->update($request->all());

        return redirect()->route('services.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Servicio eliminado correctamente.');
    }
}