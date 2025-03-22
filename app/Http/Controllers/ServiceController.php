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

    private function generateServiceId($user_id, $service_name)
    {
        $userInitials = strtoupper(substr($user_id, 0, 2));
        $serviceInitials = strtoupper(substr($service_name, 0, 2));
        $randomNumber = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        return $userInitials . $serviceInitials . $randomNumber;
    }

    public function store(ServiceRequest $data)
    {
        $validateData = $data->validated();
        $validateData['user_id'] = auth()->user()->user_id;

        $serviceId = $this->generateServiceId(
            auth()->user()->user_id,
            $validateData['name']
        );

        $service = Service::create(array_merge($validateData, [
            'service_id' => $serviceId,
        ]));

        // Siempre devolver una respuesta Inertia
        return Inertia::render('Services/Index', [
            'services' => Service::where('user_id', auth()->user()->user_id)->get(),
            'flash' => [
                'success' => 'Servicio creado correctamente.',
                'newService' => $service // Pasar el nuevo servicio para que el frontend pueda identificarlo
            ]
        ]);
    }

    public function update(ServiceRequest $request, $serviceId)
    {
        $service = Service::where('service_id', $serviceId)
            ->where('user_id', auth()->user()->user_id)
            ->firstOrFail();

        $service->update($request->all());

        // Siempre devolver una respuesta Inertia
        return Inertia::render('Services/Index', [
            'services' => Service::where('user_id', auth()->user()->user_id)->get(),
            'flash' => [
                'success' => 'Servicio actualizado correctamente.',
                'updatedService' => $service->fresh() // Pasar el servicio actualizado
            ]
        ]);
    }

    public function destroy($serviceId)
    {
        $service = Service::where('service_id', $serviceId)
            ->where('user_id', auth()->user()->user_id)
            ->firstOrFail();

        $service->delete();

        // Siempre devolver una respuesta Inertia
        return redirect()->route('services.index')->with('success', 'Servicio eliminado correctamente.');

    }
}