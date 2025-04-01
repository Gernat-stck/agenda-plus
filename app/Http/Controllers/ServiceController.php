<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceRequest;
use App\Models\Service;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        $services = Service::where('user_id', $userId)->get();
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

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;
        $validateData['user_id'] = $userId;

        $serviceId = $this->generateServiceId(
            $userId,
            $validateData['name']
        );

        $service = Service::create(array_merge($validateData, [
            'service_id' => $serviceId,
        ]));

        // Siempre devolver una respuesta Inertia
        return Inertia::render('Services/Index', [
            'services' => Service::where('user_id', $userId)->get(),
            'flash' => [
                'success' => 'Servicio creado correctamente.',
                'newService' => $service // Pasar el nuevo servicio para que el frontend pueda identificarlo
            ]
        ]);
    }

    public function update(ServiceRequest $request, $serviceId)
    {

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;

        $service = Service::where('service_id', $serviceId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $service->update($request->all());

        // Siempre devolver una respuesta Inertia
        return Inertia::render('Services/Index', [
            'services' => Service::where('user_id', $userId)->get(),
            'flash' => [
                'success' => 'Servicio actualizado correctamente.',
                'updatedService' => $service->fresh() // Pasar el servicio actualizado
            ]
        ]);
    }

    public function destroy($serviceId)
    {

        $userAuth = Auth::user();
        $userId = $userAuth->user_id;

        $service = Service::where('service_id', $serviceId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $service->delete();

        // Siempre devolver una respuesta Inertia
        return redirect()->route('services.index')->with('success', 'Servicio eliminado correctamente.');
    }
}
