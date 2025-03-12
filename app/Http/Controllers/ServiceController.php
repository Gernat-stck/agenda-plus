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