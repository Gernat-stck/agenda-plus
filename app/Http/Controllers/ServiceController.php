<?php
namespace App\Http\Controllers;

use App\Http\Requests\ServiceRequest;
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

    public function store(ServiceRequest $data)
    {
        Service::create($data->all());

        return redirect()->route('services.index')->with('success', 'Servicio creado correctamente.');
    }

    public function update(Request $request, $service)
    {
        $request->validate([
            'user_id' => 'required|string',
            'service_id' => 'required|string',
            'category' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        $service = Service::where('service_id', $service)->firstOrFail();

        $service->update($request->all());

        return redirect()->route('services.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy($service)
    {
        $service = Service::where('service_id', $service)->firstOrFail();
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Servicio eliminado correctamente.');
    }
}