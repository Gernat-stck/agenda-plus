<?php
namespace App\Http\Controllers;

use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('user_id', auth()->user()->user_id)->get();
        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }


    public function store(ServiceRequest $data)
    {
        Service::create($data->all());

        return redirect()->route('services.index')->with('success', 'Servicio creado correctamente.');
    }

    public function update(ServiceRequest $request, $serviceId)
    {
        $service = Service::where('service_id', $serviceId)
            ->where('user_id', auth()->user()->user_id)
            ->firstOrFail();

        $service->update($request->all());

        return redirect()->route('services.index')->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy($serviceId)
    {
        $service = Service::where('service_id', $serviceId)
            ->where('user_id', auth()->user()->user_id)
            ->firstOrFail();
        $service->delete();

        return redirect()->route('services.index')->with('success', 'Servicio eliminado correctamente.');
    }

}