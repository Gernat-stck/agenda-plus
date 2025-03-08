<?php

namespace App\Http\Controllers;

use App\Http\Requests\AppointmentRequest;
use App\Models\Appointments;
use Illuminate\Http\Request;

class AppoinmentController extends Controller
{
    public function index()
    {
        $Appoinments = Appointments::all();
        return response()->json($Appoinments);
    }

    public function store(AppointmentRequest $request)
    {
        $Appoinment = Appointments::create($request->validated());
        return response()->json($Appoinment, 201);
    }

    public function show($id)
    {
        $Appoinment = Appointments::findOrFail($id);
        return response()->json($Appoinment);
    }

    public function update(AppointmentRequest $request, $id)
    {
        $Appoinment = Appointments::findOrFail($id);
        $Appoinment->update($request->validated());
        return response()->json($Appoinment);
    }

    public function destroy($id)
    {
        $Appoinment = Appointments::findOrFail($id);
        $Appoinment->delete();
        return response()->json(null, 204);
    }
}